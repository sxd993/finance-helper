import { useState } from 'react';
import { PlusIcon, WalletIcon } from '../shared/ui/icons/IconComponents';
import { ConvertCard } from '../shared/ui/ConvertCard';
import { useMockConverts } from '../shared/hooks/useMockConverts';

export function ConvertsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [weeklyBudget] = useState(25000);

  const { converts, isLoading } = useMockConverts();
  console.log(converts)

  // Гарантируем массив
  const convertsArray = Array.isArray(converts) ? converts : [];
  console.log(converts)

  // Вычисляем необходимые значения
  const totalAllocated = convertsArray.reduce((sum, convert) => {
    if (convert.convert_type === 'necessary' || convert.convert_type === 'desire') {
      return sum + (convert.limit_amount || 0);
    }
    return sum;
  }, 0);

  const budgetUtilization = (totalAllocated / weeklyBudget) * 100;
  const remainingBudget = weeklyBudget - totalAllocated;

  if (isLoading) {
    return (
      <div className="pb-16">
        <div className="mx-4 mt-6">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Фильтруем конверты по типам
  const basicConverts = convertsArray.filter(c => c.convert_type === 'necessary');
  const desireConverts = convertsArray.filter(c => c.convert_type === 'desire');
  const savingConverts = convertsArray.filter(c => c.convert_type === 'saving');
  const investmentConverts = convertsArray.filter(c => c.convert_type === 'investment');

  // Используем существующие массивы
  const goalEnvelopes = [...desireConverts, ...savingConverts];
  const investmentEnvelopes = investmentConverts;

  return (
    <div className="pb-16">
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
            <h3 className="text-lg font-semibold">Еженедельные конверты</h3>
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
            {basicConverts.map(convert => (
              <ConvertCard key={convert.id} convert={convert} />
            ))}
          </div>
        </div>

        {/* Цели */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Свободные средства для целей</h4>
              <span className="text-lg text-green-600 font-semibold">
                {Math.max(0, remainingBudget * 4).toLocaleString('ru-RU')} ₽/мес
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Оставшиеся средства после еженедельных трат можно направить на долгосрочные цели
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Долгосрочные цели</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 text-orange-500 hover:text-orange-600"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Гибкие переводы из свободных средств</p>

          <div className="space-y-3">
            {goalEnvelopes.map(convert => (
              <ConvertCard key={convert.id} convert={convert} />
            ))}
          </div>
        </div>

        {/* Инвестиции */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Инвестиционные портфели</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 text-orange-500 hover:text-orange-600"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Долгосрочные инвестиции и накопления</p>

          <div className="space-y-3">
            {investmentEnvelopes.map(convert => (
              <ConvertCard key={convert.id} convert={convert} />
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Добавить конверт</h3>
            {/* Форма создания конверта */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Тип</label>
                <select className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="necessary">Еженедельный конверт</option>
                  <option value="desire">Желания</option>
                  <option value="saving">Накопления</option>
                  <option value="investment">Инвестиции</option>
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
                <label className="block text-sm text-gray-500 mb-1">Лимит/Цель</label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-700">
                  💡 Еженедельные конверты автоматически пополняются каждую неделю.
                  Цели и инвестиции пополняются из свободных средств по вашему желанию.
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
