import { useQuery } from '@tanstack/react-query';
import { GetTransactions } from '../api/TransactionsApi';

export const useTransactions = () => {
  const { data, isLoading, error } = useQuery({
      queryKey: ["transactions"],
      queryFn: GetTransactions,
  });
  
  return {
      transactions: data ? data.transactions : [],
      isLoading, 
      error
  }
}