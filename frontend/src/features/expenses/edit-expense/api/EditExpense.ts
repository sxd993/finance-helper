import type { Expense } from "@/entities/expense";
import { client } from "@/shared/api/client";

export const EditExpense = async (expense: Expense): Promise<Expense> => {
  if (!expense.id) {
    throw new Error("Expense id is required");
  }

  const response = await client.put<Expense>(`/expenses/edit-expense/${expense.id}`, expense);
  return response.data;
};
