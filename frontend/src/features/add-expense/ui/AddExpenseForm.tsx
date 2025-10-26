import { ChevronDown } from "lucide-react"

import { useAddExpenseForm } from "../models/hooks/useAddExpenseForm"
import { IconPickerField } from "../lib/icons"

export const AddExpenseForm = () => {
  const { register, onSubmit, convertTypeOptions, convertTitleOptions } = useAddExpenseForm()

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-xl"
    >
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
            defaultValue=""
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
          >
            <option value="" disabled>
              Выберите тип
            </option>
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
            {...register("convert_name", { required: true })}
            defaultValue=""
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 px-4 py-2.5 pr-10 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
          >
            <option value="" disabled>
              Выберите конверт
            </option>
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
          {...register("sum", { valueAsNumber: true, required: true })}
          type="number"
          min={0}
          placeholder="Введите сумму"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
      </div>

      <IconPickerField />

      <button
        type="submit"
        className="w-full rounded-xl bg-secondary py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-secondary-dark"
      >
        Добавить расход
      </button>
    </form>
  )
}
