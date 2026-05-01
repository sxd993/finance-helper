import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowRightLeft, CalendarClock } from "lucide-react";

import { formatTypeCode } from "@/entities/convert";
import type { RemainderHistoryItem } from "@/entities/remainders";
import { formatPrice } from "@/shared/utils/formatPrice";

interface RemainderCardProps {
  item: RemainderHistoryItem;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
};

export const RemainderCard = ({ item }: RemainderCardProps) => {
  return (
    <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <ArrowRightLeft className="h-4 w-4 text-slate-400" />
          <span>{formatPrice(item.amount)}</span>
          <span className="text-slate-400">→</span>
          <span className="truncate">{formatTypeCode(item.remainder_type.type_code)}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {item.remainder_type.start_date} - {item.remainder_type.end_date}
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
        <CalendarClock className="h-4 w-4" />
        <span>{formatDateTime(item.created_at)}</span>
      </div>
    </div>
  );
};
