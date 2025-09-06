import type { ConvertsInfo } from "../../../shared/types/types";
import { CircularProgress } from "../../../shared/ui/CircularProgress";

interface BalanceCardProps {
  info?: ConvertsInfo;
}

export const BalanceCard = ({ info }: BalanceCardProps) => {
  return (
    <section className="bg-white shadow-md rounded-3xl p-6 transition-all hover:shadow-lg border border-gray-100">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-orange-500 mb-2">
          Недельный бюджет
        </h1>
        <div className="w-12 h-0.5 bg-orange-500 mx-auto rounded-full"></div>
      </div>

      <div className="flex items-center justify-between">
        {/* Текстовая часть */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col text-sm font-medium text-gray-600">
            <p>Остаток на неделю</p>
            <p>{info?.period_start}- {info?.period_end}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {info?.current_budget?.toLocaleString("ru-RU") ?? 0} ₽
          </p>
          <p className="text-sm text-gray-500">
            из{" "}
            <span className="font-semibold text-gray-700">
              {info?.weekly_budget?.toLocaleString("ru-RU") ?? 0} ₽
            </span>
          </p>
        </div>

        {/* Круговой прогресс */}
        <div className="flex items-center justify-center rounded-2xl  text-center">
          <CircularProgress
            value={info?.current_budget}
            max={info?.weekly_budget}
            percentage={info?.percentage}
            size={85}
            strokeWidth={8}
          />
        </div>
      </div>
    </section>
  );
};