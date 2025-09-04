import { useState } from 'react';
import { Header } from '../shared/ui/Header';
import { EnvelopeCard } from '../shared/ui/EnvelopeCard';
import { FoodIcon, CarIcon, GameIcon, PhoneIcon, PlusIcon, WalletIcon } from '../shared/ui/icons/IconComponents';

export function EnvelopesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [weeklyBudget] = useState(25000);

  const basicEnvelopes = [
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

  // Подсчет использованного и доступного бюджета
  const totalAllocated = basicEnvelopes.reduce((sum, env) => sum + env.weeklyLimit, 0);
  const remainingBudget = weeklyBudget - totalAllocated;
  const budgetUtilization = (totalAllocated / weeklyBudget) * 100;

  const goalEnvelopes = [
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
    },
    {
      id: 'vacation',
      name: 'Отпуск в Японии',
      icon: GameIcon,
      iconColor: 'bg-purple-400',
      spent: 15000,
      remaining: 285000,
      goal: 300000,
      daysLeft: 180,
      isGoal: true,
      progress: 5,
      monthlyTransfer: 3000
    }
  ];

  return (
    <div className="pb-16">
      <Header title="Конверты" showUserName={true} />
      
      <div className="mx-4 mt-6">
        {/* Еженедельный бюджет */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <WalletIcon className="w-5 h-5" />
            <span className="text-blue-100">Еженедельный бюджет</span>
          </div>
          
          <div className="mb-4">
            <div className="text-2xl mb-1">{weeklyBudget.toLocaleString('ru-RU')} ₽</div>
            <div className="text-blue-100 text-sm">25 августа - 1 сентября</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">Распределено по конвертам</span>
              <span>{totalAllocated.toLocaleString('ru-RU')} ₽</span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="h-2 bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className={remainingBudget >= 0 ? 'text-green-200' : 'text-red-200'}>
                {remainingBudget >= 0 ? 'Доступно' : 'Превышение'}
              </span>
              <span className={remainingBudget >= 0 ? 'text-green-200' : 'text-red-200'}>
                {Math.abs(remainingBudget).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Основные конверты */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3>Еженедельные конверты</h3>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={remainingBudget <= 0}
              className={`p-2 ${remainingBudget > 0 ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400'}`}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Автоматическое пополнение каждую неделю</p>
          
          <div className="space-y-3">
            {basicEnvelopes.map((envelope) => (
              <EnvelopeCard key={envelope.id} {...envelope} />
            ))}
          </div>
        </div>

        {/* Цели */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4>Свободные средства для целей</h4>
              <span className="text-lg text-green-600">
                {Math.max(0, remainingBudget * 4).toLocaleString('ru-RU')} ₽/мес
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Оставшиеся средства после еженедельных трат можно направить на долгосрочные цели
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3>Долгосрочные цели</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 text-orange-500 hover:text-orange-600"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Гибкие переводы из свободных средств</p>
          
          <div className="space-y-3">
            {goalEnvelopes.map((goal) => (
              <EnvelopeCard key={goal.id} {...goal} />
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="mb-4">Добавить конверт</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Тип</label>
                <select className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Еженедельный конверт</option>
                  <option>Долгосрочная цель</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Название</label>
                <input
                  type="text"
                  placeholder="Например: Одежда"
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Еженедельный лимит</label>
                <input
                  type="number"
                  placeholder="5000"
                  max={remainingBudget}
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Доступно: {remainingBudget.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-700">
                  💡 Еженедельные конверты автоматически пополняются каждую неделю. 
                  Цели пополняются из свободных средств по вашему желанию.
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}