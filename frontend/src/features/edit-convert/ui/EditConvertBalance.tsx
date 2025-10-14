import { formatPrice } from "@/shared/utils/formatPrice";
import { useEditConvertBalance } from "../model/useEditConvertBalance";

export const EditConvertBalance = () => {
  const { group, isLoading } = useEditConvertBalance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-16 animate-pulse" />
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-16 animate-pulse" />
      </div>
    );
  }

  const current = group?.currentSum ?? 0;
  const total = group?.totalSum ?? null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-muted-foreground mb-1">Всего средств</p>
        <p className="text-2xl">{formatPrice(current)}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-muted-foreground mb-1">Общий лимит</p>
        <p className="text-2xl">{total == null ? '—' : formatPrice(total)}</p>
      </div>
    </div>
  );
}
