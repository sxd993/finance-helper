import { useState, useEffect } from 'react';
import { BalanceCard } from '../ui/BalanceCard';

export const BalanceSection = () => {
    const [balanceData, setBalanceData] = useState({
        total: 0,
        income: 0,
        expenses: 0,
        isLoading: true
    });

    useEffect(() => {
        // В реальности здесь будет API вызов
        const fetchBalance = async () => {
            // Мок данные
            setTimeout(() => {
                setBalanceData({
                    total: 85300,
                    income: 65000,
                    expenses: 23700,
                    isLoading: false
                });
            }, 1000);
        };

        fetchBalance();
    }, []);

    const trend = balanceData.income > balanceData.expenses ? 'up' : 'down';
    const trendPercentage = balanceData.income > 0 
        ? Math.round(((balanceData.income - balanceData.expenses) / balanceData.income) * 100)
        : 0;

    return (
        <section className="flex justify-center w-full">
            <BalanceCard 
                total={balanceData.total}
                income={balanceData.income}
                expenses={balanceData.expenses}
                trend={trend}
                trendPercentage={trendPercentage}
                isLoading={balanceData.isLoading}
            />
        </section>
    );
};