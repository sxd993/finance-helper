/**
 * Подготавливает ответ клиенту в едином формате.
 */
const buildExpenseResponse = (expense, convertType) => ({
  id: expense.id,
  convert_id: expense.convertId,
  name: expense.name ?? expense.title,
  convert_name: expense.convertName,
  convert_type: expense.convertType,
  convert_title: convertType?.title ?? null,
  sum: Number(expense.sum ?? expense.amount),
  date: Number(expense.date ?? expense.occurredAt),
  icon_name: expense.iconName,
});

export { buildExpenseResponse };
