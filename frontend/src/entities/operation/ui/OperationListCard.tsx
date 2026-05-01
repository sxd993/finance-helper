import type { ReactNode } from "react";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { ru } from "date-fns/locale";

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

const getOperationTime = (occurredAt: number) => {
  const date = new Date(occurredAt);
  if (Number.isNaN(date.getTime())) return "Время не указано";

  return format(date, "HH:mm", { locale: ru });
};

export const OperationListCard = ({ operation, actions }: OperationListCardProps) => {
  const isExpense = operation.type === "expense";
  const { text: convertTypeColor } = getConvertTypeColor(operation.convert_type);

  return (
    <div className="relative flex w-full items-stretch justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50/60 sm:px-5">
      {actions ? <div className="absolute right-3 top-3">{actions}</div> : null}
      <div className={`flex min-w-0 flex-1 items-center gap-3 ${actions ? "pr-10" : ""}`}>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isExpense
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isExpense ? (
              <ExpenseIcon
                name={operation.icon_name ?? "shopping-cart"}
                className="h-5 w-5"
                color={DEFAULT_EXPENSE_ICON_COLOR}
              />
            ) : (
              <ArrowUpRight className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col justify-center-safe h-full gap-1">
            <div className="truncate text-[15px] font-medium leading-5 text-slate-900">
              {operation.title}
            </div>
            <div className="truncate text-xs text-slate-500">
              {getSourceLabel(operation)}
            </div>
            <div className="text-sm font-medium text-slate-700">
              {getOperationTime(operation.occurred_at)}
            </div>
          </div>
      </div>
      <div className="flex w-[96px] shrink-0 flex-col items-end justify-between py-0.5 pl-2 sm:w-[132px]">
        <div className="h-8" />
        <span
          className={`inline-flex min-h-8 w-full items-center justify-end gap-1 text-right text-lg font-semibold leading-none ${
            isExpense ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {isExpense ? "-" : "+"}
          {formatPrice(operation.amount)}
        </span>
        <div className="flex w-full items-end justify-end">
          <span className={`truncate text-right text-xs font-medium ${convertTypeColor}`}>
            {operation.convert_title ?? operation.convert_name}
          </span>
        </div>
      </div>
    </div>
  );
};
