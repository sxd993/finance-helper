import { Op } from 'sequelize';
import {
  sequelize,
  Convert,
  ConvertType,
  ConvertTypeLimit,
} from '../../../db/index.js';

const PERCENT_KEY_BY_TYPE = {
  important: 'percentImportant',
  wishes: 'percentWishes',
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

const shouldApplyTypeLimit = (convertType) =>
  Boolean(convertType?.isReset && convertType?.hasLimit && convertType?.canSpend);

function calculateLimitValue(user, typeCode, convertType) {
  if (!user) return null;

  if (!shouldApplyTypeLimit(convertType)) {
    return null;
  }

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

async function resolveTypeLimit({ userId, user, typeCode, transaction, convertType }) {
  const typeInstance =
    convertType ||
    (await ConvertType.findOne({
      where: { code: typeCode },
      attributes: ['code', 'isReset', 'hasLimit', 'canSpend'],
      transaction,
    }));

  if (!shouldApplyTypeLimit(typeInstance)) {
    return null;
  }

  const stored = await findStoredTypeLimit(userId, typeCode, transaction);
  if (stored != null) {
    return stored;
  }

  const computed = calculateLimitValue(user, typeCode, typeInstance);
  if (computed == null) {
    return null;
  }

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
  convertType,
}) {
  const limit = await resolveTypeLimit({
    userId,
    user,
    typeCode,
    transaction,
    convertType,
  });

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
  shouldApplyTypeLimit,
};
