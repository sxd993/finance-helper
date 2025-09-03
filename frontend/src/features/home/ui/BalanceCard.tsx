import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
    total: number;
    income: number;
    expenses: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    isLoading: boolean;
}

export const BalanceCard = ({ 
    total, 
    income, 
    expenses, 
    trend, 
    trendPercentage, 
    isLoading 
}: BalanceCardProps) => {
    const [isVisible, setIsVisible] = useState(true);

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
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Баланс</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                        {trend === 'up' ? <TrendingUp size={14} className="text-orange-600" /> : <TrendingDown size={14} className="text-orange-600" />}
                        <span>{trendPercentage}%</span>
                    </div>
                    <button 
                        onClick={() => setIsVisible(!isVisible)} 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isVisible ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-5">
                {isVisible ? `${total.toLocaleString("ru-RU")} ₽` : '••••••'}
            </h2>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-3">
                    <span className="block text-xs text-gray-500 mb-1">Доходы</span>
                    <p className="text-sm font-medium text-orange-600">
                        +{income.toLocaleString("ru-RU")} ₽
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                    <span className="block text-xs text-gray-500 mb-1">Расходы</span>
                    <p className="text-sm font-medium text-gray-600">
                        -{expenses.toLocaleString("ru-RU")} ₽
                    </p>
                </div>
            </div>
        </div>
    );
};