import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { ExpenseIcon, EXPENSE_ICON_OPTIONS } from "../lib/icons"
import { useAddExpenseForm } from "../models/hooks/useAddExpenseForm"

export const AddExpenseForm = () => {
  const {
    register,
    onSubmit,
    iconName,
    iconColor,
    convertTypeOptions,
    convertTitleOptions,
    isIconMenuOpen,
    toggleIconMenu,
    handleIconSelect,
  } = useAddExpenseForm()

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-lg flex flex-col gap-6 bg-white px-8 py-10 rounded-2xl border border-slate-200 shadow-xl transition-all"
    >
      {/* Название расхода */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Название расхода</label>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Введите название"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition"
        />
      </div>

      {/* Тип конверта */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Тип конверта</label>
        <div className="relative">
          <select
            {...register("convert_type", { required: true })}
            defaultValue=""
            className="w-full appearance-none px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary outline-none pr-10 transition cursor-pointer"
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
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Название конверта */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Название конверта</label>
        <div className="relative">
          <select
            {...register("convert_name", { required: true })}
            defaultValue=""
            className="w-full appearance-none px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary outline-none pr-10 transition cursor-pointer"
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
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Сумма */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Сумма расхода</label>
        <input
          {...register("sum", { valueAsNumber: true, required: true })}
          type="number"
          min={0}
          placeholder="Введите сумму"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition"
        />
      </div>


      {/* Иконка */}
      <div className="flex flex-row justify-around gap-3 items-start relative">
        <div className="flex flex-col justify-center items-center gap-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            Иконка
          </label>
          {/* Кнопка выбора иконки */}
          <div
            onClick={toggleIconMenu}
            className="flex items-center justify-center w-14 h-14 rounded-full border border-slate-300 cursor-pointer hover:border-secondary hover:bg-slate-50 transition"
          >
            <ExpenseIcon name={iconName} color={iconColor} />
          </div>
        </div>
        {/* Цвет иконки */}
        <div className="flex flex-col justify-baseline items-center rounded-full gap-3">
          <span className="text-sm text-slate-600">Цвет</span>
          <input
            {...register("icon_color")}
            type="color"
            className="h-14 w-14 cursor-pointer rounded-full hover:border-secondary transition appearance-none p-0"
          />
        </div>
      </div>

      {/* Выпадающее меню с иконками */}
      <AnimatePresence>
        {isIconMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 z-10 bg-white border border-slate-200 shadow-lg p-4 grid grid-cols-5 gap-3"
          >
            {EXPENSE_ICON_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleIconSelect(value)}
                className="flex flex-col items-center gap-1 hover:bg-slate-100 rounded-xl p-2 transition"
              >
                <ExpenseIcon name={value} color={iconColor} />
                <span className="text-[10px] text-slate-500">{label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Кнопка отправки */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-secondary text-white text-base font-medium hover:bg-secondary-dark transition-colors shadow-sm"
      >
        Добавить расход
      </button>
    </form>
  )
}
