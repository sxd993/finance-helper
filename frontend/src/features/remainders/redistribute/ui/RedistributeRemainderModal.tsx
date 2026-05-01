import { Landmark, TrendingUp } from "lucide-react";
import { formatPrice } from "@/shared/utils/formatPrice";
import { formatTypeCode } from "@/entities/convert";
import { useRedistributeRemainderForm } from "../model/useRedistributeRemainderForm";

interface RedistributeRemainderModalProps {
  onClose: () => void;
}

export const RedistributeRemainderModal = ({ onClose }: RedistributeRemainderModalProps) => {
  const {
    register,
    onSubmit,
    formState,
    targetConverts,
    totalAmount,
    isLoading,
    isPending,
  } = useRedistributeRemainderForm(onClose);

  return (
    <form onSubmit={onSubmit} className="space-y-5 pt-1">
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm text-slate-500">Доступно для перевода</p>
        <p className="text-2xl font-semibold text-slate-950">{formatPrice(totalAmount)}</p>
        <p className="text-sm leading-6 text-slate-500">
          Остаток можно направить только в накопления или инвестиции.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 px-4 py-6 text-sm text-slate-500">
          Загрузка конвертов...
        </div>
      ) : targetConverts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          Нет доступных конвертов для накоплений или инвестиций.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Куда перевести</label>
            <select
              {...register("convertId", { required: true, valueAsNumber: true })}
              className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {targetConverts.map((convert) => (
                <option key={convert.id} value={convert.id}>
                  {convert.name} · {formatTypeCode(convert.type_code)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Сумма</label>
            <input
              {...register("amount", {
                required: true,
                valueAsNumber: true,
                min: 0.01,
                max: totalAmount,
              })}
              type="number"
              step="0.01"
              min="0.01"
              max={totalAmount}
              placeholder="Введите сумму"
              className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {formState.errors.amount && (
              <p className="text-xs text-red-500">
                Укажите сумму от 0.01 до {formatPrice(totalAmount)}.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Landmark className="h-4 w-4" />
          <span>Закрыть</span>
        </button>
        <button
          type="submit"
          disabled={isPending || isLoading || targetConverts.length === 0 || totalAmount <= 0}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TrendingUp className="h-4 w-4" />
          <span>{isPending ? "Переводим..." : "Распределить"}</span>
        </button>
      </div>
    </form>
  );
};
