import { client } from "@/shared/api/client"
import type { Expense } from "@/entities/expense"

export const AddExpense = async (expense: Expense): Promise<Expense> => {
    const response = await client.post<Expense>("/expenses/add-expense", expense)
    return response.data
}