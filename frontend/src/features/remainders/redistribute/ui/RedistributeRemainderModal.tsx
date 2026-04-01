import { Landmark, TrendingUp } from "lucide-react";

import { Button } from "@/shared/ui/Button";
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
    <form onSubmit={onSubmit} className="space-y-5 pt-5">
      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Доступно для перераспределения:{" "}
        <span className="font-semibold text-slate-900">{formatPrice(totalAmount)}</span>
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
        <>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Куда перевести</label>
            <select
              {...register("convertId", { required: true, valueAsNumber: true })}
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {targetConverts.map((convert) => (
                <option key={convert.id} value={convert.id}>
                  {convert.name} · {formatTypeCode(convert.type_code)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Сумма</label>
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
              className="rounded-2xl border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {formState.errors.amount && (
              <p className="text-xs text-red-500">
                Укажите сумму от 0.01 до {formatPrice(totalAmount)}.
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button
          title={isPending ? "Переводим..." : "Перераспределить"}
          type="submit"
          disabled={isPending || isLoading || targetConverts.length === 0 || totalAmount <= 0}
          className="flex-1"
          leftIcon={<TrendingUp className="h-4 w-4" />}
        />
        <Button
          title="Закрыть"
          bg="white"
          text="slate-700"
          onClick={onClose}
          className="flex-1"
          leftIcon={<Landmark className="h-4 w-4" />}
        />
      </div>
    </form>
  );
};
