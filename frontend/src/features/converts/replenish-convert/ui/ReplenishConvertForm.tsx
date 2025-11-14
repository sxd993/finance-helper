
import { Button } from "@/shared/ui/Button";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useReplinishConvertForm } from "../model/useReplinishConvertForm";

export const ReplenishConvertForm = () => {
  const {
    register,
    onSubmit,
    eligibleConverts,
    availableRemainder,
    isPending,
    isLoading,
    sourceTypeOptions,
    formState,
  } = useReplinishConvertForm();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Загрузка данных о конвертах...
      </div>
    );
  }

  if (eligibleConverts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600">
        Нет конвертов, которые можно пополнить.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5"
    >
      <div>
        <p className="text-base font-semibold text-slate-900">Пополнение конвертов</p>
        <p className="text-sm text-slate-500">
          Выберите источник, конверт и сумму, чтобы перевести средства между конвертами.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Тип источника</label>
        <select
          {...register("sourceType", { required: true })}
          className="rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {sourceTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}  {`(${formatPrice(option.remainder)})`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Конверт</label>
        <select
          {...register("convertId", { required: true })}
          className="rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {eligibleConverts.map((convert) => (
            <option key={convert.id} value={convert.id}>
              {convert.name}  {`(${formatPrice(convert.current_balance)})`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Сумма</label>
        <input
          {...register("amount", { valueAsNumber: true, min: 0 })}
          type="number"
          min={0}
          step="0.01"
          disabled={availableRemainder <= 0}
          className="rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {availableRemainder <= 0 && (
          <p className="text-xs text-red-500">
            Для этого типа больше нет доступных средств.
          </p>
        )}
      </div>

      <Button
        title="Перевести"
        type="submit"
        disabled={isPending || formState.isSubmitting}
      />
    </form>
  );
};
