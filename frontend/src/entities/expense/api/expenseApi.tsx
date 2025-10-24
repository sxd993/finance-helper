import { client } from "@/shared/api/client"
import type { Expense } from "../model/types"

export const getUserExpenses = async (): Promise<Expense[]> => {
    const response = await client.get<Expense[]>('/expenses/get-expenses')
    return response.data
}
