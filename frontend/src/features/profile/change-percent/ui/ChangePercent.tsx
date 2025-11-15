import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { PieChart } from "lucide-react";
import { useChangePercent } from "../model/useChangePercent";
import { DISTRIBUTION_FIELDS } from "../lib/const";
import { clampPercent, formatPercent, isValidTotal } from "../lib/helpers";

export const ChangePercent = () => {
  const {
    form,
    uiState,
    actions,
  } = useChangePercent();

  const {
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
  } = form;

  const {
    currentPercents,
    totalPercentage,
    totalError,
    successMessage,
    isPending,
    isLoadingUser,
  } = uiState;

  const { handleReset } = actions;

  const isDisabled = isPending || isLoadingUser;
  const totalIsValid = isValidTotal(totalPercentage);
  const formattedTotal = formatPercent(totalPercentage);

  return (
    <form className="rounded-2xl bg-slate-50 mb-6" onSubmit={handleSubmit}>
      <SectionTitle
        title="Доли распределения"
        icon={<PieChart size={20} className="text-primary" />}
      />

      <div className="mt-3 space-y-4">
        {DISTRIBUTION_FIELDS.map((field) => {
          const value = clampPercent(Number(currentPercents[field.key] || 0));
          const fieldError = errors[field.key];

          return (
            <div
              key={field.key}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${field.accent}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {field.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {field.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                    className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-right text-sm font-semibold text-slate-900 focus:border-primary focus:outline-none disabled:bg-slate-100"
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar color={field.accent} percentage={value} />
              </div>
              {fieldError?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {fieldError.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>Суммарное распределение</span>
        <span
          className={`font-semibold ${
            totalIsValid ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {formattedTotal}%
        </span>
      </div>
      {totalError && (
        <p className="mt-1 text-xs text-red-500 text-right">{totalError}</p>
      )}
      {successMessage && !totalError && (
        <p className="mt-2 text-sm text-emerald-600 text-center">
          {successMessage}
        </p>
      )}

      <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          title="Сбросить"
          bg="white"
          size="sm"
          text="slate-700"
          className="flex-1"
          type="button"
          onClick={handleReset}
          disabled={isDisabled || !isDirty}
        />
        <Button
          bg="primary"
          title="Сохранить"
          size="sm"
          className="flex-1"
          type="submit"
          disabled={!isDirty || !isValid || isDisabled || !totalIsValid}
        />
      </div>
    </form>
  );
};
