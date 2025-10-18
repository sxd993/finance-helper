import { client } from "@/shared/api/client"
import type { createExpenseData } from "../model/types"

export const createExpense = async (data: createExpenseData) => {
    const response = await client.post('/transaction/create-expense', data)
    return response.data
}