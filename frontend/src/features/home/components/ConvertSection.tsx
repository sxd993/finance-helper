import { useState, useEffect } from 'react';
import { ConvertList } from '../ui/ConvertList';
import type { Convert } from '../types';

export const ConvertSection = () => {
    const [converts, setConverts] = useState<Convert[]>([]);

    useEffect(() => {
        setConverts([
            {
                id: 1,
                user_id: 1,
                account_id: 1,
                name: "Еда",
                current: 6800,
                target: 10000,
                daysLeft: 3,
                isComplete: false,
                category: "food",
                one_transfer: 2250,
                nextTransfer: "понедельник",
                period_start: "2024-08-25",
                period_end: "2024-09-01",
                is_active: true,
                created_at: "2024-08-25T00:00:00Z",
                updated_at: "2024-08-30T12:00:00Z"
            },
            {
                id: 2,
                user_id: 1,
                account_id: 1,
                name: "Транспорт",
                current: 2000,
                target: 2000,
                isComplete: true,
                daysLeft: 3,
                category: "transport",
                one_transfer: 500,
                nextTransfer: "вторник",
                period_start: "2024-08-25",
                period_end: "2024-09-01",
                is_active: true,
                created_at: "2024-08-25T00:00:00Z",
                updated_at: "2024-08-29T10:30:00Z"
            },
            {
                id: 3,
                user_id: 1,
                account_id: 1,
                name: "Развлечения",
                current: 4200,
                target: 5000,
                daysLeft: 3,
                isComplete: false,
                category: "entertainment",
                one_transfer: 1000,
                nextTransfer: "среда",
                period_start: "2024-08-25",
                period_end: "2024-09-01",
                is_active: true,
                created_at: "2024-08-25T00:00:00Z",
                updated_at: "2024-08-28T15:45:00Z"
            },
            {
                id: 4,
                user_id: 1,
                account_id: 2,
                name: "iPhone 16 Pro Max",
                current: 57000,
                target: 120000,
                daysLeftToComplete: 25,
                isComplete: false,
                category: "shopping",
                one_transfer: 2500,
                nextTransfer: "среда",
                period_start: "2024-08-25",
                period_end: "2024-09-25",
                is_active: true,
                created_at: "2024-08-25T00:00:00Z",
                updated_at: "2024-08-28T15:45:00Z"
            }
        ]);
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
        </section>
    );
};