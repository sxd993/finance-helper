import { RemainderCard } from "@/entities/remainders";
import { useRemaindersHistory } from "../model/useRemaindersHistory";
import { Error, Loading } from "@/shared/ui/states";
import { RemaindersHistoryEmpty } from "./states/RemaindersHistoryEmpty";

export const RemaindersHistoryList = () => {
  const { history, isLoading, error } = useRemaindersHistory();

  if (isLoading) return <Loading title="Загрузка истории..." />;
  if (error) return <Error error_name="Ошибка при загрузке истории остатков" />;
  if (history.length === 0) return <RemaindersHistoryEmpty />;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {history.map((item) => (
        <div
          key={item.id}
          className="border-b border-slate-100 last:border-b-0"
        >
          <RemainderCard item={item} />
        </div>
      ))}
    </div>
  );
};
