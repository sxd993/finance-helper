const { Convert, ConvertType, ConvertBudgetDetails, ConvertSavingDetails, ConvertInvestmentDetails } = require('../../../db');

async function getUserConverts(userId) {
  return Convert.findAll({
    where: { userId },
    attributes: ['id', 'name'],
    include: [
      { model: ConvertType, as: 'type', attributes: ['id', 'code', 'title'] },
      { model: ConvertBudgetDetails, as: 'budget', required: false, attributes: ['monthly_limit', 'current_amount', 'overall_limit'] },
      { model: ConvertSavingDetails, as: 'saving', required: false, attributes: ['target_amount', 'current_amount'] },
      { model: ConvertInvestmentDetails, as: 'investment', required: false, attributes: ['initial_investment', 'current_value', 'last_updated'] },
    ],
    raw: true,
    nest: true,
  });
}

module.exports = { getUserConverts };
