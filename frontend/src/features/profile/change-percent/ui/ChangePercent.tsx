import { Button } from "@/shared/ui/Button";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { formatPrice } from "@/shared/utils/formatPrice";
import { PieChart } from "lucide-react";
import { useChangePercent } from "../model/useChangePercent";
import { DISTRIBUTION_FIELDS, getDistributionFieldPalette } from "../lib/const";
import { formatPercent, isValidTotal } from "../lib/helpers";

export const ChangePercent = () => {
  const { form, uiState, actions } = useChangePercent();

  const { register, handleSubmit, errors, isDirty, isValid } = form;
  const {
    currentPercents,
    monthlyIncome,
    totalPercentage,
    totalError,
    successMessage,
    isPending,
    isLoadingUser,
  } = uiState;
  const { handleReset } = actions;

  const isDisabled = isPending || isLoadingUser;
  const totalIsValid = isValidTotal(totalPercentage);

  return (
    <form className="mb-6 rounded-2xl flex flex-col gap-4" onSubmit={handleSubmit}>
      <SectionTitle
        title="Доли распределения"
        icon={<PieChart size={20} className="text-primary" />}
      />

      <div className="space-y-4">
        {DISTRIBUTION_FIELDS.map((field) => {
          const fieldError = errors[field.key];
          const palette = getDistributionFieldPalette(field.typeCode);
          const percent = Number(currentPercents[field.key] || 0);
          const amount = (monthlyIncome * percent) / 100;

          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <label className="flex items-center gap-2 text-lg text-gray-500">
                    <span className={`h-2.5 w-2.5 rounded-full ${palette.bg}`} />
                    {field.label}
                  </label>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {field.description}
                  </p>
                  <p className="text-xs font-medium text-slate-700">
                    {formatPrice(amount) ?? "0 ₽"}
                  </p>
                </div>
                <div className="flex w-28 shrink-0 items-center gap-2 rounded-2xl border border-slate-400 px-4 py-3 ring-inset focus-within:border-slate-600">
                  <input
                    type="number"
                    step="1"
                    disabled={isDisabled}
                    {...register(field.key, {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Доля не может быть меньше 0%",
                      },
                      max: {
                        value: 100,
                        message: "Доля не может превышать 100%",
                      },
                    })}
                    className="w-full border-none bg-transparent text-right text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 disabled:bg-transparent"
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>

              {fieldError?.message && (
                <p className="text-xs text-red-500">{fieldError.message}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between px-1 py-2 text-base">
        <span className="text-slate-600">Суммарное распределение</span>
        <span
          className={`text-lg font-semibold ${
            totalIsValid ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {formatPercent(totalPercentage, 0)}%
        </span>
      </div>

      {totalError && (
        <p className="mt-2 text-xs text-red-500 text-right">{totalError}</p>
      )}
      {!totalError && !totalIsValid && (
        <p className="mt-2 text-xs text-red-500 text-right">
          Сумма процентов должна равняться 100%
        </p>
      )}
      {successMessage && totalIsValid && (
        <p className="mt-4 whitespace-pre-line text-sm text-emerald-600 text-center">
          {successMessage}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          title="Сбросить"
          bg="white"
          text="slate-700"
          className="flex-1 border border-slate-200"
          type="button"
          onClick={handleReset}
          disabled={isDisabled || !isDirty}
        />
        <Button
          bg="secondary"
          title={isPending ? "Сохраняем..." : "Сохранить"}
          className="flex-1"
          type="submit"
          disabled={!isDirty || !isValid || isDisabled || !totalIsValid}
        />
      </div>
    </form>
  );
};
