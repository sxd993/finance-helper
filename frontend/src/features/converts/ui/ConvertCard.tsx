import type { Convert } from "../../../shared/types/types";
import { formatConvertsDate } from "../utils/formatConvertsDate";

interface ConvertCardProps {
  convert: Convert;
}

export const ConvertCard = ({ convert }: ConvertCardProps) => {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{convert.convert_name}</h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Текущая сумма:</span>
          <span className="font-semibold text-green-500">
            {convert.current_amount.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {convert.limit_amount && (
          <div className="flex justify-between">
            <span className="font-medium">Лимит:</span>
            <span>{convert.limit_amount.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}

        {convert.target_amount && (
          <div className="flex justify-between">
            <span className="font-medium">Цель:</span>
            <span>{convert.target_amount.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}

        {convert.one_transfer && (
          <div className="flex justify-between">
            <span className="font-medium">Разовый перевод:</span>
            <span>{convert.one_transfer.toLocaleString("ru-RU")} ₽</span>
          </div>
        )}

        {convert.next_transfer && (
          <div className="flex justify-between">
            <span className="font-medium">Следующее пополнение:</span>
            <span>{formatConvertsDate(convert.next_transfer)}</span>
          </div>
        )}

        {convert.period_start && convert.period_end && (
          <div className="flex justify-between">
            <span className="font-medium">Период:</span>
            <span>
              {formatConvertsDate(convert.period_start)} – {formatConvertsDate(convert.period_end)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
