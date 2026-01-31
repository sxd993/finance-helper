import type { Expense } from "@/entities/expense"
import { client } from "@/shared/api/client"

export type GetUserExpensesParams = {
    convert_type?: string
}

export type GetUserExpensesResponse = {
    expenses: Expense[]
    current_cycle_spent: number
}

export const GetUserExpenses = async (
    filters?: GetUserExpensesParams
): Promise<GetUserExpensesResponse> => {
    const response = await client.get<GetUserExpensesResponse>("/expenses/get-expenses", {
        params: filters,
    })

    return response.data
}
