import type { Convert } from "@/entities/convert";
import type { ConvertTab } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
import { Button } from "@/shared/ui/Button";
import { formatPrice } from "@/shared/utils/formatPrice";
import { useReplinishConvertForm } from "../model/useReplinishConvertForm";

interface ReplenishConvertFormProps {
  converts: Convert[];
  targetTypeCodes: ConvertTab[];
  title: string;
  description?: string;
}

export const ReplenishConvertForm = ({
  converts,
  targetTypeCodes,
  title,
  description,
}: ReplenishConvertFormProps) => {
  const {
    register,
    onSubmit,
    eligibleConverts,
    selectedConvert,
    isValidAmount,
    isPending,
    formState,
  } = useReplinishConvertForm({ converts, targetTypeCodes });

  const hasOptions = eligibleConverts.length > 0;

  if (!hasOptions) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600">
        Для выбранного типа нет конвертов, которые можно пополнить.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
    >
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Конверт</label>
        <select
          {...register("convertId", { required: true })}
          className="rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {eligibleConverts.map((convert) => (
            <option key={convert.id} value={convert.id}>
              {convert.name} ({formatPrice(convert.current_balance) ?? "—"})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Сумма пополнения</label>
        <input
          {...register("amount", { valueAsNumber: true, min: 0 })}
          type="number"
          min={0}
          step="0.01"
          className="rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="text-xs text-slate-500">
          Доступно сейчас: {formatPrice(selectedConvert?.current_balance ?? 0) ?? "—"}
        </p>
      </div>

      <Button
        title="Пополнить"
        type="submit"
        disabled={!isValidAmount || isPending || formState.isSubmitting}
      />
    </form>
  );
};
