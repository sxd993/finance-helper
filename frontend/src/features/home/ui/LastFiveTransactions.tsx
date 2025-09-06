import type { Transaction } from "../../../shared/types/types";
import { Link } from "react-router-dom";
import { formatTransactionDate } from '../../../shared/utils/formatDate';
import { useMemo } from "react";

interface LastFiveTransactionsProps {
    last_transactions?: Transaction[];
}

export const LastFiveTransactions = ({ last_transactions }: LastFiveTransactionsProps) => {

    // Мемоизация всех дат для оптимизации
    const formattedTransactions = useMemo(() => {
        return last_transactions?.map(tx => ({
            ...tx,
            formattedDate: formatTransactionDate(tx.transactions_date)
        })) || [];
    }, [last_transactions]);


    return (
        <section className="  p-5 rounded-2xl">
            {/* Заголовок */}
            <div className="text-center mb-4 flex justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                    Последние операции
                </h1>
                <Link className='text-blue-500' to={'/expenses'}>
                    Все
                </Link>
            </div>

            {/* Последние транзакции */}
            <div className="">
                {formattedTransactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center py-2">
                        <div>
                            <p className="text-base font-medium text-gray-900">
                                {transaction.transactions_name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {transaction.formattedDate}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="font-semibold text-red-500">
                                -{transaction.transactions_amount.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className="text-sm text-gray-500">
                                {transaction.transactions_subcategory}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
