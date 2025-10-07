import { client } from "@/shared/api/client"
import type { createExpenseData, createIncomeData } from "../model/types"

export const createExpense = async (data: createExpenseData) => {
    const response = await client.post('/transaction/create-expense', data)
    return response.data
}

export const createIncome = async (data: createIncomeData) => {
    const response = await client.post('/transaction/create-income', data)
    return response.data
}