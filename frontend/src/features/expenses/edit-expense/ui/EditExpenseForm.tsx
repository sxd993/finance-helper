import { ChevronDown } from "lucide-react";

import type { Expense } from "@/entities/expense";
import { IconSelectField } from "@/features/ui/pick-icons";
import { Button } from "@/shared/ui/Button";

import { useEditExpenseForm } from "../model/useEditExpenseForm";

interface EditExpenseFormProps {
  expense: Expense;
  onClose: () => void;
}

export const EditExpenseForm = ({ expense, onClose }: EditExpenseFormProps) => {
  const { register, onSubmit, convertTypeOptions, convertTitleOptions, isPending } =
    useEditExpenseForm(expense, onClose);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Название расхода</label>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Введите название"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Тип конверта</label>
        <div className="relative">
          <select
            {...register("convert_type", { required: true })}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
          >
            {convertTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Название конверта</label>
        <div className="relative">
          <select
            {...register("convert_id", {
              required: true,
              setValueAs: (value) => Number(value),
            })}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
          >
            {convertTitleOptions.map((convert) => (
              <option key={convert.value} value={convert.value}>
                {convert.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Сумма расхода</label>
        <input
          {...register("sum", { required: true, valueAsNumber: true })}
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Дата расхода</label>
        <input
          {...register("date")}
          type="date"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
      </div>

      <IconSelectField />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          title={isPending ? "Сохранение..." : "Сохранить"}
          type="submit"
          disabled={isPending}
          className="w-full"
        />
        <Button
          title="Отменить"
          bg="white"
          text="slate-700"
          onClick={onClose}
          className="w-full"
        />
      </div>
    </form>
  );
};
