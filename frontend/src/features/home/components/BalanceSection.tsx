interface BalanceSectionProps {
  balance?: number;
  income?: number;
  expenses?: number;
  weeklyBudget?: number;
  availableForGoals?: number;
  convertBalance?: number;
}

export const BalanceSection = ({
  balance = 85300,
  income = 65000,
  expenses = 23700,
  convertBalance = 13000
}: BalanceSectionProps) => {
  return (
    <div className="bg-orange-500 flex justify-between rounded-3xl px-5 py-2 text-white  mx-1 shadow-lg">
      <div className="flex flex-col justify-center max-w-[50%]">
        <div>
          <div className="text-orange-100 text-sm mb-1 text-left">Общий баланс</div>
          <p className="text-2xl mb-2">{balance.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div>
          <div className="text-orange-100 text-sm mb-1 text-left">Остаток средств на текущую неделю</div>
          <div className="text-2xl mb-2">{convertBalance.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <h1 className="text-sm text-orange-100 mb-1">Доходы</h1>
          <p className="text-lg">+{income.toLocaleString('ru-RU')} ₽</p>
        </div>

        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-sm text-orange-100 mb-1">Расходы</div>
          <div className="text-lg">-{expenses.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>
    </div>
  );
}