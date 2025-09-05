import { useState } from 'react';

export function SettingsPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(260000);
  const [weeklyBudget, setWeeklyBudget] = useState(25000);
  const [userName, setUserName] = useState('Владимир');
  const [currency, setCurrency] = useState('₽');

  const weeklyIncomeEstimate = monthlyIncome / 4;
  const savingsPerWeek = Math.max(0, weeklyIncomeEstimate - weeklyBudget);
  const savingsPerMonth = savingsPerWeek * 4;

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
              <div className="text-xs text-gray-500 mt-1">
                ≈ {weeklyIncomeEstimate.toLocaleString('ru-RU')} {currency}/неделя
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Еженедельный бюджет на траты</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={weeklyBudget}
                  onChange={(e) => setWeeklyBudget(Number(e.target.value))}
                  max={weeklyIncomeEstimate}
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-600">{currency}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Этот бюджет будет разделен между вашими конвертами
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
              <span className="text-green-600">Доход в неделю</span>
              <span className="text-green-800">{weeklyIncomeEstimate.toLocaleString('ru-RU')} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Бюджет на траты</span>
              <span className="text-green-800">-{weeklyBudget.toLocaleString('ru-RU')} {currency}</span>
            </div>
            <div className="border-t border-green-200 pt-2">
              <div className="flex justify-between">
                <span className="text-green-600">Доступно для целей в неделю</span>
                <span className="text-green-800">{savingsPerWeek.toLocaleString('ru-RU')} {currency}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-green-600">Потенциал накоплений в месяц</span>
                <span className="text-green-800 font-medium">{savingsPerMonth.toLocaleString('ru-RU')} {currency}</span>
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
              <span>Еженедельные отчеты</span>
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