import {client} from '../../../shared/api/client'
import type { Transaction } from '../../../types/types';

interface TransactionsResponse {
    transactions: Transaction[]
}

export const GetTransactions = async () => {
    const response = await client.get<TransactionsResponse>('/transaction/get-transactions')
    return response.data;
}