import { useAuth } from '../features/auth/hooks/useAuth';

export const HomePage = () => {
  const { user } = useAuth();
  const balance = (user?.balance || 0) - 0; // пока расходов нет
  const income = user?.balance || 0;
  const expenses = 0; // будет из API

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col items-center pt-6 gap-6 w-full pb-8">
        <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Главная</h1>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              Добро пожаловать, <span className="text-orange-600">{user?.name || 'Пользователь'}</span>!
            </p>
          </div>
        </div>

        {/* Карточка баланса */}
        <div className="flex flex-col items-center gap-2 justify-top shadow-lg bg-white w-[90%] max-w-md rounded-lg p-5">
          <div className="flex flex-col">
            <h1 className="text-center w-full text-gray-700">Общее состояние финансов</h1>
            <h1 className="text-4xl text-center w-full flex gap-2 justify-center font-bold text-gray-900">
              {balance} ₽
            </h1>
          </div>
          <div className="flex flex-row items-center justify-between w-full mt-4">
            <h1 className="text-gray-700">Доходы</h1>
            <h1 className="text-xl text-orange-500 font-semibold">{income} ₽</h1>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-gray-700">Расходы</h1>
            <h1 className="text-xl text-orange-500 font-semibold">{expenses} ₽</h1>
          </div>
        </div>
      </div>
    </div>
  );
};