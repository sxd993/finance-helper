import type { ConvertsInfo } from "../../../shared/types/types";
import { CircularProgress } from "../../../shared/ui/CircularProgress";

interface BalanceCardProps {
  info?: ConvertsInfo;
}

export const BalanceCard = ({ info }: BalanceCardProps) => {
  return (
    <section className="bg-white shadow-sm rounded-2xl p-5">
      {/* Заголовок */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Недельный бюджет
        </h1>
      </div>

      <div className="flex items-center justify-between">
        {/* Текстовая часть */}
        <div>
          <p className="text-sm text-gray-500">Остаток на неделю</p>
          <p className="text-2xl font-bold text-gray-900">
            {info?.current_budget?.toLocaleString("ru-RU") ?? 0} ₽
          </p>
          <p className="text-sm text-gray-500 mt-1">
            из {info?.weekly_budget?.toLocaleString("ru-RU") ?? 0} ₽
          </p>
        </div>

        {/* Круговой прогресс */}
        <div>
          <CircularProgress
            value={info?.current_budget}
            max={info?.weekly_budget}
            percentage={info?.percentage}
            size={80}
            strokeWidth={8}
          />

        </div>
      </div>
    </section>
  );
};
