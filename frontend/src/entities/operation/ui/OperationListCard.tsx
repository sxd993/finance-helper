import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { getConvertTypeColor } from "@/entities/convert";
import type { Operation } from "@/entities/operation";
import { DEFAULT_EXPENSE_ICON_COLOR, ExpenseIcon } from "@/features/ui/pick-icons";
import { formatPrice } from "@/shared/utils/formatPrice";

interface OperationListCardProps {
  operation: Operation;
  actions?: ReactNode;
}

const getSourceLabel = (operation: Operation) => {
  if (operation.type === "expense") return "Списание";
  return operation.source === "remainder" ? "Пополнение из остатков" : "Пополнение из лимита";
};

export const OperationListCard = ({ operation, actions }: OperationListCardProps) => {
  const isExpense = operation.type === "expense";
  const {
    text: convertTypeColor,
    bg: convertTypeBackground,
    softBg: convertTypeSoftBackground,
  } = getConvertTypeColor(operation.convert_type);

  return (
    <div className="flex w-full items-start justify-between gap-4 p-4">
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50">
            {isExpense ? (
              <ExpenseIcon
                name={operation.icon_name ?? "shopping-cart"}
                className="h-5 w-5"
                color={DEFAULT_EXPENSE_ICON_COLOR}
              />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium leading-5 text-slate-900">
              {operation.title}
            </div>
            <div className="mt-0.5 truncate text-xs text-slate-500">
              {getSourceLabel(operation)}
            </div>
          </div>
        </div>
        <div className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 ${convertTypeSoftBackground}`}>
          <span className={`h-2 w-2 rounded-full ${convertTypeBackground}`} />
          <span className={`text-xs font-medium ${convertTypeColor}`}>
            {operation.convert_title ?? operation.convert_name}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {actions}
        <span className={`inline-flex items-center gap-1 text-end text-lg font-semibold leading-none ${isExpense ? "text-red-500" : "text-emerald-600"}`}>
          {isExpense ? <ArrowDownLeft className="h-4 w-4" /> : null}
          {isExpense ? "-" : "+"}
          {formatPrice(operation.amount)}
        </span>
      </div>
    </div>
  );
};

