import { client } from "@/shared/api/client";

export const DeleteExpense = async (id: number) => {
  const response = await client.delete(`/expenses/delete-expense/${id}`);
  return response.data;
};
