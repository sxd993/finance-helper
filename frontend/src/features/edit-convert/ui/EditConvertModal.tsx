import type { Convert } from "@/entities/convert";
import { useEditConvertForm } from "../model/useEditConvertForm";
import { Button } from "@/shared/ui/Button";
import { formatPrice } from "@/shared/utils/formatPrice";

interface EditConvertModalProps
  extends Pick<Convert, "id" | "name" | "target_amount" | "initial_amount"> {
  convert_type_limit?: number | null;
  convert_type_used?: number | null;
  convert_type_available?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const EditConvertModal = ({
  id,
  name,
  target_amount,
  convert_type_limit,
  convert_type_used,
  convert_type_available,
  onClose,
}: EditConvertModalProps) => {
  const { register, onSubmit, isPending, formState } = useEditConvertForm({
    id,
    name,
    target_amount
  });

  const isSaving = isPending || formState.isSubmitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-slate-500">
            Лимит категории
          </span>
          <span className="text-lg font-semibold text-slate-900">
            {formatPrice(convert_type_limit ?? undefined)}
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <span className="text-lg font-semibold text-slate-500">
            Использовано:
          </span>
          <span className="text-lg font-semibold text-slate-900">
            {formatPrice(convert_type_used ?? undefined)}
          </span>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <span className="text-lg font-semibold text-slate-500">
            Доступно
          </span>
          <span className="text-lg font-semibold text-slate-900">
            {formatPrice(convert_type_available ?? undefined)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Название */}
        <div className="group">
          <label className="block mb-2.5">
            <span className="inline-block text-sm font-medium text-slate-700 mb-1.5">
              Название
            </span>
            <input
              type="text"
              className="w-full h-12 px-4 text-base text-slate-800 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="Введите название"
              {...register("name")}
            />
          </label>
        </div>

        {/* Текущий лимит */}
        <div className="group">
          <label className="block mb-2.5">
            <span className="inline-block text-sm font-medium text-slate-700 mb-1.5">
              Текущий лимит
            </span>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                className="w-full h-12 px-4 text-base text-slate-800 bg-white border-2 border-slate-200 rounded-xl transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                placeholder="0.00"
                {...register("target_amount", { valueAsNumber: true })}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        {onClose && (
          <Button
            title="Отменить"
            bg="white"
            text="slate-700"
            className="w-full sm:w-auto"
            onClick={onClose}
          />
        )}
        <Button
          title={isSaving ? "Сохранение…" : "Сохранить"}
          bg="primary"
          text="white"
          className="w-full sm:w-auto"
          disabled={isSaving}
        />
      </footer>
    </form>
  );
};
