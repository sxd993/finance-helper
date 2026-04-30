import type { Expense } from "@/entities/expense";
import type { Operation } from "../model/types";

export const toExpense = (operation: Operation): Expense => ({
  id: operation.id,
  convert_id: operation.convert_id ?? 0,
  name: operation.title,
  convert_type: operation.convert_type,
  convert_name: operation.convert_name,
  convert_title: operation.convert_title ?? undefined,
  sum: operation.amount,
  date: operation.occurred_at,
  icon_name: operation.icon_name ?? "shopping-cart",
});

