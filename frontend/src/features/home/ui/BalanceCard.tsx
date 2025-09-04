import { WalletIcon } from '../../../shared/ui/icons/IconComponents';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  weeklyBudget?: number;
  availableForGoals?: number;
}

export function BalanceCard({ balance, income, expenses, weeklyBudget, availableForGoals }: BalanceCardProps) {
  return (
    <div className="mx-4 mb-6">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <WalletIcon className="w-6 h-6 text-white" />
          <span className="text-orange-100">Общий баланс</span>
        </div>

        <div className="mb-6">
          <span className="text-3xl">{balance.toLocaleString('ru-RU')} ₽</span>
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

          {weeklyBudget && (
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-sm text-orange-100 mb-1">Недельный бюджет</div>
              <div className="text-lg">{weeklyBudget.toLocaleString('ru-RU')} ₽</div>
            </div>
          )}

          {availableForGoals !== undefined && (
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-sm text-orange-100 mb-1">На цели</div>
              <div className="text-lg">+{availableForGoals.toLocaleString('ru-RU')} ₽</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

