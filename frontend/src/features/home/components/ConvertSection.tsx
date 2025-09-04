import { useState } from 'react';
import { EnvelopeCard } from '../../../shared/ui/EnvelopeCard';
import { FoodIcon, CarIcon, GameIcon, PhoneIcon, ChevronRightIcon } from '../../../shared/ui/icons/IconComponents';

export function ConvertSection() {
  const [activeCategory, setActiveCategory] = useState<'envelopes' | 'goals'>('envelopes');
  const weeklyBudget = 25000;
  const weeklyIncomeEstimate = 65000; // 260k / 4

  const envelopes = [
    {
      id: 'food',
      name: 'Еда',
      icon: FoodIcon,
      iconColor: 'bg-orange-500',
      spent: 6800,
      remaining: 3200,
      goal: 10000,
      weeklyLimit: 10000,
      daysLeft: 3,
      isOverBudget: false,
      showCautionMessage: false
    },
    {
      id: 'transport',
      name: 'Транспорт',
      icon: CarIcon,
      iconColor: 'bg-red-500',
      spent: 2000,
      remaining: 0,
      goal: 2000,
      weeklyLimit: 2000,
      daysLeft: 3,
      isOverBudget: true,
      showCautionMessage: true,
      cautionMessage: "Бюджет исчерпан!"
    },
    {
      id: 'entertainment',
      name: 'Развлечения',
      icon: GameIcon,
      iconColor: 'bg-purple-500',
      spent: 4200,
      remaining: 800,
      goal: 5000,
      weeklyLimit: 5000,
      daysLeft: 3,
      isOverBudget: false,
      showCautionMessage: true,
      cautionMessage: "Осторожно с тратами!"
    }
  ];

  const totalWeeklySpending = envelopes.reduce((sum, env) => sum + env.weeklyLimit, 0);
  const availableForGoals = weeklyIncomeEstimate - totalWeeklySpending;

  const goals = [
    {
      id: 'phone',
      name: 'iPhone 16 Pro Max',
      icon: PhoneIcon,
      iconColor: 'bg-blue-500',
      spent: 57000,
      remaining: 63000,
      goal: 120000,
      daysLeft: 25,
      isGoal: true,
      progress: 48,
      monthlyTransfer: 2500
    },
    {
      id: 'car',
      name: 'Новая машина',
      icon: CarIcon,
      iconColor: 'bg-green-500',
      spent: 150000,
      remaining: 350000,
      goal: 500000,
      daysLeft: 240,
      isGoal: true,
      progress: 30,
      monthlyTransfer: 5000
    }
  ];

  const currentItems = activeCategory === 'envelopes' ? envelopes : goals;

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2>{activeCategory === 'envelopes' ? 'Финансовые конверты' : 'Мои цели'}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveCategory(activeCategory === 'envelopes' ? 'goals' : 'envelopes')}
              className="flex items-center space-x-1 text-orange-500 hover:text-orange-600"
            >
              <span className="text-sm">
                {activeCategory === 'envelopes' ? 'Цели' : 'Конверты'}
              </span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {activeCategory === 'envelopes' 
            ? '25 августа - 1 сентября' 
            : 'Долгосрочные финансовые цели'
          }
        </p>
      </div>
      
      <div className="space-y-3">
        {currentItems.map((item) => (
          <EnvelopeCard key={item.id} {...item} />
        ))}
      </div>

      {activeCategory === 'envelopes' && (
        <div className="mt-4 bg-blue-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-blue-800">Недельный бюджет</h4>
            <span className="text-blue-600">{weeklyBudget.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="text-sm text-blue-600">
            Использовано: {totalWeeklySpending.toLocaleString('ru-RU')} ₽ 
            • Доступно для целей: {availableForGoals.toLocaleString('ru-RU')} ₽/неделя
          </div>
        </div>
      )}
    </div>
  );
}