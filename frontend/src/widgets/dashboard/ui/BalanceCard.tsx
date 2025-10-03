const formatCurrency = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString('ru-RU') : '0';

interface BalanceCardProps {
  weeklyLimit: number;
}

export const BalanceCard = ({ weeklyLimit }: BalanceCardProps) => (
  <section className="bg-white shadow-md rounded-3xl p-6 transition-all hover:shadow-lg border border-gray-100">
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold mb-2">Ваш баланс</h1>
      <div className="w-12 h-0.5 bg-orange-500 mx-auto rounded-full" />
    </div>

    <div className="flex items-center justify-between gap-6">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">Бюджет на неделю</span>
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(weeklyLimit)} ₽
        </span>
        <span className="text-xs text-gray-500">
        </span>
      </div>
    </div>
  </section>
);

