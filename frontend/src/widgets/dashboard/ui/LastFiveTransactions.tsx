import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import type { Transaction } from '@shared/types/types';
import { formatDate } from '@shared/utils/formatDate';

interface LastFiveTransactionsProps {
    last_transactions?: Transaction[];
}

export const LastFiveTransactions = ({ last_transactions }: LastFiveTransactionsProps) => {
    const formattedTransactions = useMemo(() => {
        return last_transactions?.map(tx => ({
            ...tx,
            formattedDate: formatDate(tx.transactions_date)
        })) || [];
    }, [last_transactions]);

    return (
        <section className="rounded-2xl shadow-sm bg-white p-4">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                    Последние операции
                </h1>
                <Link 
                    className="text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
                    to={'/expenses'}
                >
                    Все
                </Link>
            </div>

            {/* Последние транзакции */}
            <div className="space-y-4">
                {formattedTransactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className="flex justify-between items-center p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white"
                    >
                        {/* Левая часть */}
                        <div>
                            <p className="text-base font-medium text-gray-900">
                                {transaction.transactions_name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {transaction.formattedDate}
                            </p>
                        </div>

                        {/* Правая часть */}
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
