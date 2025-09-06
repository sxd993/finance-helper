import { useQuery } from '@tanstack/react-query';
import type { Transaction } from '../types/types';
import { getLastTransactions } from '../api/TransactionsApi';

export const useMockLastTransactions = () => {
    const { data: last_transactions, isLoading: isLastTransactionsLoading, error } = useQuery<Transaction[]>({
        queryKey: ['last-transactions'],
        queryFn: getLastTransactions,
        staleTime: 30 * 60 * 1600
    })
    return {
        last_transactions,
        isLastTransactionsLoading,
        error
    }
}