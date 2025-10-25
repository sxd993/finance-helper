import { client } from "@/shared/api/client"
import type { Expense } from "../model/types"

export type GetUserExpensesParams = {
    convert_type?: string
}

export const getUserExpenses = async (
    filters?: GetUserExpensesParams
): Promise<Expense[]> => {
    const response = await client.get<Expense[]>("/expenses/get-expenses", {
        params: filters,
    })

    return response.data
}

export const addExpense = async (expense: Expense): Promise<Expense> => {
    const response = await client.post<Expense>("/expenses/add-expense", expense)
    return response.data
}