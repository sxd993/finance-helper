import { Op, fn, col, literal } from 'sequelize';
import {
  ConvertType,
  ConvertTypeLimit,
  Convert,
  ConvertSpend,
  ConvertSaving,
  ConvertInvestment,
  Operation,
  Cycle,
} from '../../../db/index.js';
import { RESETTABLE_TYPES } from '../../../features/cycles/utils.js';

const PERCENT_KEY_BY_TYPE = {
  important: 'percentImportant',
  wishes: 'percentWishes',
  saving: 'percentSaving',
  investment: 'percentInvestment',
};

const RESETTABLE_LIMIT_TYPES = new Set(
  RESETTABLE_TYPES.filter((code) => Boolean(code) && code !== 'wish')
);

const toNumberOrZero = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeLimit = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Number(num.toFixed(2));
};

const shouldApplyTypeLimit = (convertType) =>
  Boolean(convertType?.isReset && convertType?.hasLimit && convertType?.canSpend);

function calculateLimitValue(user, typeCode, convertType, { force = false } = {}) {
  if (!user) return null;
  if (!force && !shouldApplyTypeLimit(convertType)) return null;

  const percentKey = PERCENT_KEY_BY_TYPE[typeCode];
  if (!percentKey) return null;

  const monthlyIncome = toNumberOrZero(user.monthlyIncome);
  const percent = toNumberOrZero(user[percentKey]);
  if (!monthlyIncome || !percent) return 0;

  return Number(((monthlyIncome * percent) / 100).toFixed(2));
}

async function upsertTypeLimit(userId, typeCode, limit, transaction) {
  const normalized = normalizeLimit(limit);
  if (normalized == null) return;
  await ConvertTypeLimit.upsert({ userId, typeCode, limitAmount: normalized }, { transaction });
}

async function findStoredTypeLimit(userId, typeCode, transaction) {
  const row = await ConvertTypeLimit.findOne({
    where: { userId, typeCode },
    attributes: ['limitAmount'],
    raw: true,
    transaction,
  });
  return row ? toNumberOrNull(row.limitAmount) : null;
}

async function resolveTypeLimit({ userId, user, typeCode, transaction, convertType }) {
  const typeInstance =
    convertType ||
    (await ConvertType.findOne({
      where: { code: typeCode },
      attributes: ['code', 'isReset', 'hasLimit', 'canSpend'],
      transaction,
    }));

  if (!shouldApplyTypeLimit(typeInstance)) return null;

  const stored = await findStoredTypeLimit(userId, typeCode, transaction);
  if (stored != null) return stored;

  const computed = calculateLimitValue(user, typeCode, typeInstance);
  if (computed == null) return null;

  await upsertTypeLimit(userId, typeCode, computed, transaction);
  return computed;
}

async function getTypeLimitsMap({ userId, user, transaction }) {
  const types = await ConvertType.findAll({
    attributes: ['code', 'isReset', 'hasLimit', 'canSpend'],
    transaction,
  });

  const entries = await Promise.all(
    types.map(async (type) => {
      const limit = await resolveTypeLimit({
        userId,
        user,
        typeCode: type.code,
        transaction,
        convertType: type,
      });
      return [type.code, limit != null ? Number(limit) : null];
    })
  );

  return Object.fromEntries(entries);
}

async function getAllocatedAmount(userId, typeCode, { excludeConvertId, transaction } = {}) {
  const where = { userId, typeCode, isActive: true };
  const converts = await Convert.findAll({
    where,
    attributes: ['id'],
    raw: true,
    transaction,
  });

  const ids = converts
    .map((c) => Number(c.id))
    .filter((id) => Number.isFinite(id) && (!excludeConvertId || id !== excludeConvertId));

  if (!ids.length) return 0;

  if (typeCode === 'important' || typeCode === 'wishes') {
    const rows = await ConvertSpend.findAll({
      where: { convertId: ids },
      attributes: ['monthlyLimit'],
      raw: true,
      transaction,
    });
    return Number(rows.reduce((sum, row) => sum + toNumberOrZero(row.monthlyLimit), 0).toFixed(2));
  }

  if (typeCode === 'saving') {
    const rows = await ConvertSaving.findAll({
      where: { convertId: ids },
      attributes: ['savedAmount'],
      raw: true,
      transaction,
    });
    return Number(rows.reduce((sum, row) => sum + toNumberOrZero(row.savedAmount), 0).toFixed(2));
  }

  if (typeCode === 'investment') {
    const rows = await ConvertInvestment.findAll({
      where: { convertId: ids },
      attributes: ['investedAmount'],
      raw: true,
      transaction,
    });
    return Number(rows.reduce((sum, row) => sum + toNumberOrZero(row.investedAmount), 0).toFixed(2));
  }

  return 0;
}

async function getSpentAmountInActiveCycle(userId, typeCode, { transaction } = {}) {
  const activeCycle = await Cycle.findOne({
    where: { userId, isClosed: false },
    order: [['id', 'DESC']],
    attributes: ['startDate', 'endDate'],
    transaction,
  });

  if (!activeCycle) return 0;

  const startMs = new Date(activeCycle.startDate).getTime();
  const endMs = activeCycle.endDate ? new Date(activeCycle.endDate).getTime() : Date.now();

  const row = await Operation.findOne({
    where: {
      userId,
      type: 'expense',
      convertType: typeCode,
      occurredAt: { [Op.between]: [startMs, endMs] },
    },
    attributes: [[fn('COALESCE', fn('SUM', col('amount')), literal('0')), 'spent']],
    raw: true,
    transaction,
  });

  return Number(Number(row?.spent ?? 0).toFixed(2));
}

async function updateDistributedAmount(userId, typeCode, { transaction, value } = {}) {
  const distributed = value != null ? normalizeLimit(value) : await getAllocatedAmount(userId, typeCode, { transaction });
  return distributed == null ? 0 : distributed;
}

async function recalcUserTypeLimitsAndResetDistributed(user, { transaction } = {}) {
  const userId = user.id;
  const types = await ConvertType.findAll({
    attributes: ['code', 'isReset', 'hasLimit', 'canSpend'],
    transaction,
  });

  for (const type of types) {
    if (!RESETTABLE_LIMIT_TYPES.has(type.code)) continue;
    const newLimit = calculateLimitValue(user, type.code, type, { force: true });
    if (newLimit == null) continue;

    await ConvertTypeLimit.upsert(
      { userId, typeCode: type.code, limitAmount: normalizeLimit(newLimit) ?? 0 },
      { transaction }
    );
  }
}

async function getUserTypeLimitsOverview({ userId, user, transaction }) {
  const [limitsMap, convertTypes] = await Promise.all([
    getTypeLimitsMap({ userId, user, transaction }),
    ConvertType.findAll({
      attributes: ['code', 'title', 'description', 'isReset', 'hasLimit', 'canSpend', 'sortOrder'],
      order: [['sortOrder', 'ASC']],
      transaction,
    }),
  ]);

  const usedEntries = await Promise.all(
    convertTypes.map(async (type) => [type.code, await getAllocatedAmount(userId, type.code, { transaction })])
  );
  const usedByType = Object.fromEntries(usedEntries);

  const convertRows = await Convert.findAll({
    where: { userId },
    attributes: ['typeCode'],
    raw: true,
    transaction,
  });
  const convertsCountByType = convertRows.reduce((acc, row) => {
    const code = row.typeCode;
    acc[code] = (acc[code] ?? 0) + 1;
    return acc;
  }, {});

  const investmentRows = await ConvertInvestment.findAll({
    include: [{ model: Convert, as: 'convert', attributes: ['userId', 'typeCode'], where: { userId, typeCode: 'investment' } }],
    attributes: ['investedAmount', 'currentValue'],
    raw: true,
    transaction,
  });

  const initialTotal = normalizeLimit(investmentRows.reduce((sum, row) => sum + toNumberOrZero(row.invested_amount ?? row.investedAmount), 0));
  const currentTotal = normalizeLimit(investmentRows.reduce((sum, row) => sum + toNumberOrZero(row.current_value ?? row.currentValue), 0));

  return convertTypes.map((type) => {
    const code = type.code;
    const rawLimit = limitsMap[code];
    const normalizedLimit = rawLimit != null ? Number(Number(rawLimit).toFixed(2)) : null;
    const used = Number((usedByType[code] ?? 0).toFixed(2));
    const available = normalizedLimit != null
      ? Number(Math.max(normalizedLimit - used, 0).toFixed(2))
      : null;
    const percentKey = PERCENT_KEY_BY_TYPE[code];
    const percent = percentKey && user ? toNumberOrNull(user[percentKey]) : null;

    return {
      code,
      title: type.title,
      description: type.description ?? null,
      is_reset: Boolean(type.isReset),
      has_limit: Boolean(type.hasLimit),
      can_spend: Boolean(type.canSpend),
      limit: normalizedLimit,
      used,
      available,
      converts_count: convertsCountByType[code] ?? 0,
      percent,
      initial_total: code === 'investment' ? initialTotal : null,
      current_total: code === 'investment' ? currentTotal : null,
    };
  });
}

async function ensureWithinTypeLimit({
  userId,
  user,
  typeCode,
  amount,
  transaction,
  excludeConvertId,
  convertType,
}) {
  const limit = await resolveTypeLimit({ userId, user, typeCode, transaction, convertType });

  if (limit == null) {
    return {
      valid: true,
      limit: null,
      used: 0,
      available: null,
      required: toNumberOrZero(amount),
    };
  }

  const existing = await getAllocatedAmount(userId, typeCode, { excludeConvertId, transaction });
  const amountToAllocate = toNumberOrZero(amount);
  const isSpendType = typeCode === 'important' || typeCode === 'wishes';
  const spent = isSpendType
    ? await getSpentAmountInActiveCycle(userId, typeCode, { transaction })
    : 0;
  const maxAllocatable = isSpendType ? Number(Math.max(limit - spent, 0).toFixed(2)) : limit;
  const total = existing + amountToAllocate;
  const available = Number(Math.max(maxAllocatable - existing, 0).toFixed(2));

  return {
    valid: total <= maxAllocatable + 1e-6,
    limit,
    used: existing,
    available,
    required: amountToAllocate,
  };
}

export {
  calculateLimitValue,
  getTypeLimitsMap,
  getUserTypeLimitsOverview,
  ensureWithinTypeLimit,
  shouldApplyTypeLimit,
  updateDistributedAmount,
  recalcUserTypeLimitsAndResetDistributed,
  getAllocatedAmount,
  normalizeLimit,
};
