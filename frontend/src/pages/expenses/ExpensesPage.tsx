import { useState } from 'react';
import { Wallet } from 'lucide-react';

import { CarIcon, FoodIcon, GameIcon } from '@shared/ui/icons/IconComponents';

export const ExpensesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'transport' | 'entertainment'>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
    const expenses = [
        {
            id: 1,
            name: 'Продукты в Пятерочке',
            amount: 2450,
            category: 'Еда',
            icon: FoodIcon,
            iconColor: 'bg-orange-500',
            date: '4 сен',
            time: '18:45'
        },
        {
            id: 2,
            name: 'Заправка автомобиля',
            amount: 3200,
            category: 'Транспорт',
            icon: CarIcon,
            iconColor: 'bg-red-500',
            date: '4 сен',
            time: '12:30'
        },
        {
            id: 3,
            name: 'Netflix подписка',
            amount: 799,
            category: 'Развлечения',
            icon: GameIcon,
            iconColor: 'bg-purple-500',
            date: '3 сен',
            time: '09:15'
        },
        {
            id: 4,
            name: 'Обед в кафе',
            amount: 1150,
            category: 'Еда',
            icon: FoodIcon,
            iconColor: 'bg-orange-500',
            date: '3 сен',
            time: '13:20'
        },
        {
            id: 5,
            name: 'Такси до дома',
            amount: 650,
            category: 'Транспорт',
            icon: CarIcon,
            iconColor: 'bg-red-500',
            date: '2 сен',
            time: '22:10'
        },
        {
            id: 6,
            name: 'Покупка игры Steam',
            amount: 2299,
            category: 'Развлечения',
            icon: GameIcon,
            iconColor: 'bg-purple-500',
            date: '2 сен',
            time: '16:45'
        }
    ];

    const filteredExpenses = expenses.filter(expense => {
        if (selectedCategory === 'all') return true;
        return expense.category.toLowerCase() === selectedCategory;
    });

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categories = [
        { id: 'all', label: 'Все', color: 'bg-gray-500' },
        { id: 'food', label: 'Еда', color: 'bg-orange-500' },
        { id: 'transport', label: 'Транспорт', color: 'bg-red-500' },
        { id: 'entertainment', label: 'Развлечения', color: 'bg-purple-500' }
    ];

    const periods = [
        { id: 'week', label: 'Неделя' },
        { id: 'month', label: 'Месяц' },
        { id: 'year', label: 'Год' }
    ];

    return (
        <div className="pb-16">


            <div className="mx-4 mt-6">
                {/* Фильтры */}
                <div className="mb-6">
                    {/* Фильтр по периоду */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                        {periods.map((period) => (
                            <button
                                key={period.id}
                                onClick={() => setSelectedPeriod(period.id as any)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${selectedPeriod === period.id
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>

                    {/* Фильтр по категориям */}
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id as any)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedCategory === category.id
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${selectedCategory === category.id ? 'bg-white' : category.color
                                    }`}></div>
                                <span className="text-sm">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Сводка трат */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <Wallet className="w-5 h-5 text-red-500" />
                        <span className="text-gray-600">
                            Общие траты за {selectedPeriod === 'week' ? 'неделю' : selectedPeriod === 'month' ? 'месяц' : 'год'}
                            {selectedCategory !== 'all' && ` · ${categories.find(c => c.id === selectedCategory)?.label}`}
                        </span>
                    </div>

                    <div className="mb-2">
                        <span className="text-2xl">{totalExpenses.toLocaleString('ru-RU')} ₽</span>
                    </div>

                    <div className="text-sm text-gray-500">
                        {selectedPeriod === 'week' ? '25 августа - 1 сентября' :
                            selectedPeriod === 'month' ? 'Август 2024' : '2024 год'}
                    </div>
                </div>

                {/* Список трат */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3>Транзакции</h3>
                        <span className="text-sm text-gray-500">{filteredExpenses.length} из {expenses.length}</span>
                    </div>

                    {filteredExpenses.map((expense) => (
                        <div key={expense.id} className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-lg ${expense.iconColor} flex items-center justify-center`}>
                                        <expense.icon className="w-5 h-5 text-white" />
                                    </div>

                                    <div>
                                        <div className="">{expense.name}</div>
                                        <div className="text-sm text-gray-500">{expense.category}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-red-600">-{expense.amount.toLocaleString('ru-RU')} ₽</div>
                                    <div className="text-sm text-gray-500">{expense.date} {expense.time}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Статистика по категориям */}
                <div className="mt-8">
                    <h3 className="mb-3">По категориям</h3>
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span>Еда</span>
                                </div>
                                <span>3 600 ₽</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Транспорт</span>
                                </div>
                                <span>3 850 ₽</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span>Развлечения</span>
                                </div>
                                <span>3 098 ₽</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}