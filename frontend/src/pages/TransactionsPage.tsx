import { TransactionList } from '../features/transactions/components/TransactionsList';
import { useTransactions } from '../features/transactions/hooks/useTransactions';

export const TransactionsPage = () => {
    const { transactions, isLoading, error } = useTransactions();
    
    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка загрузки</div>;
    
    return (
        <TransactionList transactions={transactions} />
    )
}