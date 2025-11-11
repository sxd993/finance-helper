import type { Expense } from "@/entities/expense"
import { client } from "@/shared/api/client"

export type GetUserExpensesParams = {
    convert_type?: string
}

export const GetUserExpenses = async (
    filters?: GetUserExpensesParams
): Promise<Expense[]> => {
    const response = await client.get<Expense[]>("/expenses/get-expenses", {
        params: filters,
    })

    return response.data
}
