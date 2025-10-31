import { formatPrice } from "@/shared/utils/formatPrice";
import { useConvertByTypes } from "../model/useConvertByTypes";
import { Wallet, Gauge } from "lucide-react";

export const ConvertsByTypeBalance = () => {
  const { convert_overview_group } = useConvertByTypes();

  const currentSum = convert_overview_group?.currentSum ?? 0;
  const limit = convert_overview_group?.info.convert_type_limit ?? null;

  return (
    <div className="flex flex-wrap gap-6 justify-between">
      {/* Баланс */}
      <div className="flex-1 min-w-[220px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Общий баланс</p>
        </div>
        <p className="text-2xl font-semibold text-gray-900">{formatPrice(currentSum)}</p>
      </div>

      {/* Лимит */}
      {limit !== null && (
        <div className="flex-1 min-w-[220px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary rounded-xl">
              <Gauge className="text-white w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Общий лимит</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{formatPrice(limit)}</p>

          {/* Прогресс, если есть лимит */}
          <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-500"
              style={{
                width: `${Math.min((currentSum / limit) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {Math.min((currentSum / limit) * 100, 100).toFixed(1)}% от лимита
          </p>
        </div>
      )}
    </div>
  );
};
