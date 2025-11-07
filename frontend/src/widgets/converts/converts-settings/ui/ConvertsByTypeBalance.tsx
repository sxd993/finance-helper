import { formatPrice } from "@/shared/utils/formatPrice";
import { Wallet } from "lucide-react";

export const ConvertsByTypeBalance = () => {

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
        <p className="text-2xl font-semibold text-gray-900">{formatPrice(1)}</p>
      </div>
    </div>
  );
};
