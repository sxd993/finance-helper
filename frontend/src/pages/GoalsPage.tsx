import { PageTitle } from "../ui/PageTitle";
import { GoalIcon } from "../features/goals/ui/GoalIcon";

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount);
};

interface Goal {
  id: number;
  title: string;
  amount: number;
  currentAmount: number;
}

export const GoalsPage = () => {
  const goals: Goal[] = [
    { id: 1, title: "Купить машину", amount: 1000000, currentAmount: 250000 },
    { id: 2, title: "Отпуск в Японии", amount: 300000, currentAmount: 2800 },
    { id: 3, title: "Новый MacBook", amount: 150000, currentAmount: 140000 }
  ];

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-6 px-5">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-full p-8">
            <svg className="w-12 h-12 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Начните с первой цели</h3>
            <p className="text-gray-500">Добавьте цель и начните откладывать на мечту</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Добавить цель
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col items-center pt-6 gap-6 w-full pb-8">
    <PageTitle title="Цели" icon ={<GoalIcon/>} isButton={true}/>
        
        <div className="w-[90%] max-w-md flex flex-col gap-4">
          {goals.map((goal) => {
            const percent = Math.min(100, (goal.currentAmount / goal.amount) * 100);
            const isNearComplete = percent >= 85;
            
            return (
              <div
                key={goal.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Фоновый градиент для прогресса */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-50 to-transparent opacity-40 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
                
                <div className="relative z-10">
                  <div className="flex flex-row justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{goal.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatMoney(goal.currentAmount)} ₽ из {formatMoney(goal.amount)} ₽
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isNearComplete && (
                        <div className="bg-green-100 p-1 rounded-full">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 8V6z"/>
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isNearComplete 
                          ? 'bg-gradient-to-r from-green-400 to-green-500' 
                          : 'bg-gradient-to-r from-orange-400 to-orange-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-gray-400">
                      Осталось: {formatMoney(goal.amount - goal.currentAmount)} ₽
                    </span>
                    {isNearComplete && (
                      <span className="text-green-600 font-medium">Почти готово! 🎉</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};