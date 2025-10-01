import { useQuery } from '@tanstack/react-query';

import { getLastTransactions } from '@entities/transaction/api/transactionsApi';
import type { Transaction } from '@entities/transaction/model/types';

export const useLastTransactions = () => {
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
