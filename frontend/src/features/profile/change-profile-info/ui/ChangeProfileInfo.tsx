import { Button } from "@/shared/ui/Button";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { UserRound } from "lucide-react";
import { useChangeProfileInfo } from "../model/useChangeProfileInfo";

export const ChangeProfileInfo = () => {
  const {
    register,
    errors,
    onSubmit,
    handleReset,
    isDirty,
    isPending,
    isLoadingUser,
    successMessage,
  } = useChangeProfileInfo();

  const isDisabled = isPending || isLoadingUser;

  return (
    <form className="rounded-2xl" onSubmit={onSubmit}>
      <SectionTitle title="Профиль" icon={<UserRound size={20} className="text-primary" />} />
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Имя</label>
          <input
            type="text"
            {...register("name", {
              required: "Имя обязательно",
              minLength: { value: 2, message: "Минимум 2 символа" },
              maxLength: { value: 60, message: "Максимум 60 символов" },
            })}
            disabled={isDisabled}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary disabled:bg-slate-50"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Логин</label>
          <input
            type="text"
            {...register("login", {
              required: "Логин обязателен",
              minLength: { value: 3, message: "Минимум 3 символа" },
              maxLength: { value: 32, message: "Максимум 32 символа" },
            })}
            disabled={isDisabled}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary disabled:bg-slate-50"
          />
          {errors.login && (
            <p className="text-xs text-red-500">{errors.login.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email обязателен",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Введите корректный email",
              },
            })}
            disabled={isDisabled}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-primary disabled:bg-slate-50"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Ежемесячный доход</label>
          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 ring-inset focus-within:border-primary">
            <input
              type="number"
              step="0.01"
              {...register("monthlyIncome", {
                min: { value: 0, message: "Доход не может быть отрицательным" },
              })}
              disabled={isDisabled}
              className="w-full border-none bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 disabled:bg-transparent"
            />
          </div>
          {errors.monthlyIncome && (
            <p className="text-xs text-red-500">{errors.monthlyIncome.message}</p>
          )}
        </div>
      </div>

      {successMessage && (
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
          bg="primary"
          title="Сохранить"
          className="flex-1"
          type="submit"
          disabled={!isDirty || isDisabled}
        />
      </div>

    </form>
  );
};
