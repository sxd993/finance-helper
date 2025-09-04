import { Wallet } from 'lucide-react';
import type { BalanceCardProps } from '../types'; 


export const BalanceCard = ({
    total,
    income,
    expenses,
    isLoading
}: BalanceCardProps) => {

    if (isLoading) {
        return (
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-5 border border-gray-200">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-7 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between w-full max-w-md mx-auto bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex flex-col justify-around">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Баланс</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {`${total.toLocaleString("ru-RU")} ₽`}
                </h2>
            </div>
            <div className="flex flex-row justify-around gap-1">
                <div className="rounded-xl border border-gray-200 p-3">
                    <span className="block text-xs text-gray-500">Доходы</span>
                    <p className="text-sm font-medium text-orange-600">
                        {income.toLocaleString("ru-RU")} ₽
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                    <span className="block text-xs text-gray-500">Расходы</span>
                    <p className="text-sm font-medium text-gray-600">
                        {expenses.toLocaleString("ru-RU")} ₽
                    </p>
                </div>
            </div>
        </div>
    );
};