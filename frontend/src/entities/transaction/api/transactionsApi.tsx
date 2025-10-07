import { client } from "@/shared/api/client"
import type { CreateTopUpTransactionDto } from "../types"

export const createTopUpTransaction = async (data: CreateTopUpTransactionDto) => {
    const response = await client.post('/transaction/create-top-up-transaction', data)
    return response.data
}