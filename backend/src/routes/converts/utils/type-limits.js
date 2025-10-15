const { Op } = require('sequelize');
const {
  sequelize,
  Convert,
  ConvertImportantDetails,
  ConvertWishesDetails,
  ConvertSavingDetails,
  ConvertInvestmentDetails,
  ConvertTypeLimit,
} = require('../../../db');

const PERCENT_KEY_BY_TYPE = {
  important: 'percentImportant',
  wishes: 'percentWishes',
  saving: 'percentSaving',
  investment: 'percentInvestment',
};

const DETAIL_CONFIG = {
  important: { model: ConvertImportantDetails, as: 'important', column: 'overall_limit' },
  wishes: { model: ConvertWishesDetails, as: 'wishes', column: 'overall_limit' },
  saving: { model: ConvertSavingDetails, as: 'saving', column: 'target_amount' },
  investment: { model: ConvertInvestmentDetails, as: 'investment', column: 'initial_investment' },
};

const toNumberOrZero = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
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
  await ConvertTypeLimit.upsert({
    userId,
    typeCode,
    limit_amount: limit != null ? Number(limit) : null,
    updated_at: new Date(),
  }, { transaction });
}

async function getTypeLimitsMap({ userId, user, transaction }) {
  const entries = Object.keys(PERCENT_KEY_BY_TYPE).map(async (code) => {
    const limit = calculateLimitValue(user, code);
    await upsertTypeLimit(userId, code, limit, transaction);
    return [code, limit];
  });

  const resolved = await Promise.all(entries);
  return Object.fromEntries(resolved);
}

async function getAllocatedAmount(userId, typeCode, { excludeConvertId, transaction }) {
  const config = DETAIL_CONFIG[typeCode];
  if (!config) {
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
          sequelize.fn('SUM', sequelize.col(`${config.as}.${config.column}`)),
          0,
        ),
        'total',
      ],
    ],
    include: [
      {
        model: config.model,
        as: config.as,
        attributes: [],
        required: false,
      },
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
  const limit = calculateLimitValue(user, typeCode);
  await upsertTypeLimit(userId, typeCode, limit, transaction);

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

module.exports = {
  calculateLimitValue,
  getTypeLimitsMap,
  ensureWithinTypeLimit,
};
