interface BalanceSectionProps {
  balance?: number;
  income?: number;
  expenses?: number;
  weeklyBudget?: number;
  availableForGoals?: number;
}

export const BalanceSection = ({
  balance = 85300,
  income = 65000,
  expenses = 23700,
  weeklyBudget = 25000,
  availableForGoals = 40000
}: BalanceSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white mx-1 shadow-lg">
      <div className="mb-6">
        <div className="text-orange-100 text-sm mb-1">Общий баланс</div>
        <div className="text-3xl mb-2">{balance.toLocaleString('ru-RU')} ₽</div>
        <div className="text-orange-100 text-sm">На всех счетах</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-sm text-orange-100 mb-1">Доходы</div>
          <div className="text-lg">+{income.toLocaleString('ru-RU')} ₽</div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-sm text-orange-100 mb-1">Расходы</div>
          <div className="text-lg">-{expenses.toLocaleString('ru-RU')} ₽</div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-sm text-orange-100 mb-1">Недельный бюджет</div>
          <div className="text-lg">{weeklyBudget.toLocaleString('ru-RU')} ₽</div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-sm text-orange-100 mb-1">На цели</div>
          <div className="text-lg">+{availableForGoals.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>
    </div>
  );
}