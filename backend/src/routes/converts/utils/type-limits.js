import { Op } from 'sequelize';
import {
  sequelize,
  Convert,
  ConvertTypeLimit,
} from '../../../db/index.js';

const PERCENT_KEY_BY_TYPE = {
  important: 'percentImportant',
  wishes: 'percentWishes',
  saving: 'percentSaving',
  investment: 'percentInvestment',
};

const LIMIT_COLUMN_BY_TYPE = {
  important: 'target_amount',
  wishes: 'target_amount',
  saving: 'target_amount',
  investment: 'initial_amount',
};

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
  if (!Number.isFinite(num)) {
    return null;
  }
  return Number(num.toFixed(2));
};

function calculateLimitValue(user, typeCode) {
  if (!user) return null;

  const percentKey = PERCENT_KEY_BY_TYPE[typeCode];
  if (!percentKey) return null;

  const monthlyIncome = toNumberOrZero(user.monthlyIncome);
  const percent = toNumberOrZero(user[percentKey]);

  if (!monthlyIncome || !percent) {
    return 0;
  }

  const limit = (monthlyIncome * percent) / 100;
  return Number(limit.toFixed(2));
}

async function upsertTypeLimit(userId, typeCode, limit, transaction) {
  const normalized = normalizeLimit(limit);
  if (normalized == null) {
    return;
  }

  await ConvertTypeLimit.upsert({
    userId,
    typeCode,
    limitAmount: normalized,
  }, { transaction });
}

async function findStoredTypeLimit(userId, typeCode, transaction) {
  const row = await ConvertTypeLimit.findOne({
    where: { userId, typeCode },
    attributes: ['limitAmount'],
    raw: true,
    transaction,
  });

  if (!row) {
    return null;
  }

  return toNumberOrNull(row.limitAmount);
}

async function resolveTypeLimit({ userId, user, typeCode, transaction }) {
  const stored = await findStoredTypeLimit(userId, typeCode, transaction);
  if (stored != null) {
    return stored;
  }

  const computed = calculateLimitValue(user, typeCode);
  if (computed == null) {
    return null;
  }

  await upsertTypeLimit(userId, typeCode, computed, transaction);
  return computed;
}

async function getTypeLimitsMap({ userId, user, transaction }) {
  const entries = await Promise.all(
    Object.keys(PERCENT_KEY_BY_TYPE).map(async (code) => {
      const limit = await resolveTypeLimit({ userId, user, typeCode: code, transaction });
      return [code, limit != null ? Number(limit) : null];
    }),
  );

  return Object.fromEntries(entries);
}

async function getAllocatedAmount(userId, typeCode, { excludeConvertId, transaction }) {
  const column = LIMIT_COLUMN_BY_TYPE[typeCode];
  if (!column) {
    return 0;
  }

  const where = { userId, typeCode };
  if (excludeConvertId) {
    where.id = { [Op.ne]: excludeConvertId };
  }

  const result = await Convert.findOne({
    where,
    attributes: [
      [
        sequelize.fn(
          'COALESCE',
          sequelize.fn('SUM', sequelize.col(`Convert.${column}`)),
          0,
        ),
        'total',
      ],
    ],
    raw: true,
    transaction,
  });

  return toNumberOrZero(result?.total);
}

async function ensureWithinTypeLimit({
  userId,
  user,
  typeCode,
  amount,
  transaction,
  excludeConvertId,
}) {
  const limit = await resolveTypeLimit({ userId, user, typeCode, transaction });

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
  const total = existing + amountToAllocate;
  const available = Number((limit - existing).toFixed(2));

  return {
    valid: total <= limit + 1e-6,
    limit,
    used: existing,
    available,
    required: amountToAllocate,
  };
}
export {
  calculateLimitValue,
  getTypeLimitsMap,
  ensureWithinTypeLimit,
};
