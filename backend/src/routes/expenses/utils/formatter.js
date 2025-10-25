/**
 * Подготавливает ответ клиенту в едином формате.
 */
const buildExpenseResponse = (expense, convertType) => ({
  id: expense.id,
  name: expense.name,
  convert_name: expense.convertName,
  convert_type: expense.convertType,
  convert_title: convertType?.title ?? null,
  sum: Number(expense.sum),
  date: Number(expense.date),
  icon_name: expense.iconName,
  icon_color: expense.iconColor,
});

module.exports = {
  buildExpenseResponse,
};
