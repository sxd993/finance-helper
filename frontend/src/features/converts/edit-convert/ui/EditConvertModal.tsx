import { useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Convert, ConvertInfo } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";
import { Button } from "@/shared/ui/Button";

import { useEditConvert } from "../model/useEditConvert";

interface EditConvertModalProps {
  convert: Convert;
  overviewInfo?: ConvertInfo | null;
  onClose: () => void;
}

interface EditConvertFormValues {
  name: string;
  target_amount: number | null;
  initial_amount: number | null;
  is_active: boolean;
}

const ACCUMULATION_TYPES = new Set(["saving", "investment"]);

const normalizeNumber = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? Number(value) : null;

export const EditConvertModal = ({ convert, overviewInfo, onClose }: EditConvertModalProps) => {
  const showTargetField = Boolean(convert.type?.has_limit ?? true);
  const showInitialField = ACCUMULATION_TYPES.has(convert.type_code);

  const defaultTarget = convert.target_amount ?? 0;
  const defaultInitial = convert.initial_amount ?? convert.current_balance ?? convert.target_amount ?? 0;

  const form = useForm<EditConvertFormValues>({
    defaultValues: {
      name: convert.name,
      target_amount: defaultTarget,
      initial_amount: defaultInitial,
      is_active: convert.is_active,
    },
  });

  const { editConvert, isPending } = useEditConvert();

  const onSubmit = form.handleSubmit(async (values) => {
    const payloadTarget = showTargetField
      ? normalizeNumber(values.target_amount) ?? defaultTarget
      : null;

    const payloadInitial = showInitialField
      ? normalizeNumber(values.initial_amount) ?? defaultInitial
      : convert.initial_amount ?? defaultInitial;

    await editConvert({
      id: convert.id,
      name: values.name.trim() || convert.name,
      type_code: convert.type_code,
      target_amount: payloadTarget,
      initial_amount: payloadInitial,
      is_active: values.is_active,
    });

    onClose();
  });

  const selectedLimitInfo = useMemo(() => {
    if (!overviewInfo) return null;
    return {
      total: overviewInfo.total_limit ?? null,
      used: overviewInfo.used_limit ?? null,
      available: overviewInfo.avaliable_limit ?? null,
    };
  }, [overviewInfo]);

  const disableSubmit = isPending || !form.formState.isDirty;

  return (
    <form className="flex flex-col gap-5 py-5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">Название</label>
        <input
          {...form.register("name", { required: true })}
          type="text"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {showTargetField && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">
            {ACCUMULATION_TYPES.has(convert.type_code) ? "Цель" : "Лимит"}
          </label>
          <input
            {...form.register("target_amount", { valueAsNumber: true })}
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {showInitialField && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Текущий баланс</label>
          <input
            {...form.register("initial_amount", { valueAsNumber: true })}
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-slate-500">
            Реальный остаток после расходов: {formatPrice(convert.current_balance) ?? "—"}
          </p>
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" {...form.register("is_active")} className="rounded border-slate-300" />
        Конверт активен
      </label>

      {selectedLimitInfo && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            Всего по типу: <span className="font-semibold">{formatPrice(selectedLimitInfo.total ?? 0)}</span>
          </p>
          <p>
            Использовано: <span className="font-semibold">{formatPrice(selectedLimitInfo.used ?? 0)}</span>
          </p>
          <p>
            Доступно:{" "}
            <span className="font-semibold">
              {formatPrice(selectedLimitInfo.available ?? selectedLimitInfo.total ?? 0)}
            </span>
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button title="Сохранить" type="submit" disabled={disableSubmit} />
        <Button title="Отменить" type="button" bg="white" text="slate-700" onClick={onClose} />
      </div>
    </form>
  );
};
