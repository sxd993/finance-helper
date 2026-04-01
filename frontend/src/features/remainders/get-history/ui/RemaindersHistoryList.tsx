import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowRightLeft, CalendarClock } from "lucide-react";

import { formatTypeCode } from "@/entities/convert";
import { useRemaindersHistory } from "../model/useRemaindersHistory";
import { formatPrice } from "@/shared/utils/formatPrice";
import { Error, Loading } from "@/shared/ui/states";
import { RemaindersHistoryEmpty } from "./states/RemaindersHistoryEmpty";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
};

export const RemaindersHistoryList = () => {
  const { history, isLoading, error } = useRemaindersHistory();

  if (isLoading) return <Loading title="Загрузка истории..." />;
  if (error) return <Error error_name="Ошибка при загрузке истории перераспределений" />;
  if (history.length === 0) return <RemaindersHistoryEmpty />;

  return (
    <div className="flex flex-col gap-3">
      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                <span>{formatPrice(item.amount)}</span>
                <span className="text-slate-400">→</span>
                <span>{item.target_convert.name}</span>
              </div>
              <p className="text-sm text-slate-500">
                {formatTypeCode(item.target_convert.type_code)}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <CalendarClock className="h-4 w-4" />
              <span>{formatDateTime(item.created_at)}</span>
            </div>
          </div>

          {item.sources.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.sources.map((source) => (
                <span
                  key={source.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                >
                  {source.start_date} - {source.end_date}: {formatPrice(source.amount)}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
