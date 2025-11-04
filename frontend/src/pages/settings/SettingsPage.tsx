import { useState } from 'react';
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export function SettingsPage() {
  useScrollToTop();
  const [monthlyIncome, setMonthlyIncome] = useState(260000);
  const [monthlyBudget, setMonthlyBudget] = useState(180000);
  const [userName, setUserName] = useState('Владимир');
  const [currency, setCurrency] = useState('₽');

  const savingsPerMonth = Math.max(0, monthlyIncome - monthlyBudget);
  const savingsPerYear = savingsPerMonth * 12;

  return (
    <div className="pb-16">
      <div className="mx-4 mt-6">
        {/* Профиль */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="mb-3">Профиль</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Имя</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Финансы */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="mb-3">Финансовые настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Месячный доход</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-600">{currency}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Ежемесячный бюджет на траты</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-600">{currency}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Этот бюджет распределяется между вашими конвертами в течение месяца
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Валюта</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="₽">Рубли (₽)</option>
                <option value="$">Доллары ($)</option>
                <option value="€">Евро (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Планируемые накопления */}
        <div className="bg-green-50 rounded-2xl p-4 mb-6">
          <h3 className="mb-3 text-green-800">Планируемые накопления</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">Доход за месяц</span>
              <span className="text-green-800">{monthlyIncome.toLocaleString('ru-RU')} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Бюджет на траты</span>
              <span className="text-green-800">-{monthlyBudget.toLocaleString('ru-RU')} {currency}</span>
            </div>
            <div className="border-t border-green-200 pt-2">
              <div className="flex justify-between">
                <span className="text-green-600">Доступно для целей в месяц</span>
                <span className="text-green-800">{savingsPerMonth.toLocaleString('ru-RU')} {currency}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-green-600">Потенциал накоплений в год</span>
                <span className="text-green-800 font-medium">{savingsPerYear.toLocaleString('ru-RU')} {currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="mb-3">Уведомления</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Превышение бюджета</span>
              <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Ежемесячные отчеты</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Достижение целей</span>
              <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="space-y-3">
          <button className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors">
            Сохранить настройки
          </button>
          
          <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors">
            Экспорт данных
          </button>
          
          <button className="w-full bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition-colors">
            Сброс всех данных
          </button>
        </div>
      </div>
    </div>
  );
}
