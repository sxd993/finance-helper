import { useState, useEffect } from 'react';
import { ConvertList } from '../ui/ConvertList';
import { GoalsCard } from '../ui/GoalsCard';

interface Convert {
    id: number;
    name: string;
    current: number;
    target: number;
    daysLeft: number;
    isComplete: boolean;
    category: string;
}

interface GoalsData {
    name: string;
    one_transfer: number;
    total_goals_sum: number;
    total_saved: number;
    nextTransfer: string;
}

export const ConvertSection = () => {
    const [converts, setConverts] = useState<Convert[]>([]);
    const [goalsData, setGoalsData] = useState<GoalsData | null>(null);

    useEffect(() => {
        // Мок данные - в реальности API вызов
        setConverts([
            { 
                id: 1, 
                name: "Еда", 
                current: 6800, 
                target: 10000, 
                daysLeft: 3, 
                isComplete: false, 
                category: "food" 
            },
            { 
                id: 2, 
                name: "Транспорт", 
                current: 2000, 
                target: 2000, 
                isComplete: true, 
                daysLeft: 3, 
                category: "transport" 
            },
            { 
                id: 3, 
                name: "Развлечения", 
                current: 4200, 
                target: 5000, 
                daysLeft: 3, 
                isComplete: false, 
                category: "entertainment" 
            }
        ]);

        setGoalsData({
            name: "Накопления на цели",
            one_transfer: 2250,
            total_goals_sum: 200000,
            total_saved: 127400,
            nextTransfer: "понедельник"
        });
    }, []);

    const handleConvertClick = (convertId: number) => {
        console.log(`Клик по конверту: ${convertId}`);
    };

    return (
        <section className='flex flex-col w-[90%] mx-auto gap-6'>
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Финансовые конверты
                </h2>
                <p className="text-sm text-gray-500">25 августа - 1 сентября</p>
            </div>

            <ConvertList 
                converts={converts}
                onConvertClick={handleConvertClick}
            />

            {goalsData && (
                <GoalsCard goalsData={goalsData} />
            )}
        </section>
    );
};