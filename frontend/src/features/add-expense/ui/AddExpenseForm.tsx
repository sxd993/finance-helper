import { ExpenseIcon, EXPENSE_ICON_OPTIONS } from "../lib/icons"
import { useAddExpenseForm } from "../models/hooks/useAddExpenseForm"

export const AddExpenseForm = () => {
    const { register, onSubmit, watch } = useAddExpenseForm()

    const selectedIcon = watch("icon_name")
    const selectedColor = watch("icon_color")

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white px-6 py-8 flex flex-col items-center gap-4 rounded-lg w-full border border-slate-200 shadow-lg"
        >
            {/* Иконка и цвет */}
            <div className="flex flex-col gap-2 w-full">
                <h2>Иконка</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200">
                            <ExpenseIcon name={selectedIcon} color={selectedColor} size={28} />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            Цвет
                            <input
                                {...register("icon_color")}
                                type="color"
                                className="h-10 w-16 cursor-pointer rounded border border-slate-200"
                            />
                        </label>
                    </div>
                    <select
                        {...register("icon_name", { required: true })}
                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
                    >
                        {EXPENSE_ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Название */}
            <div className="flex flex-col gap-2 w-full">
                <h2>Название расхода</h2>
                <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Название расхода"
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
                />
            </div>

            {/* Сумма */}
            <div className="flex flex-col gap-2 w-full">
                <h2>Сумма расхода</h2>
                <input
                    {...register("sum", { valueAsNumber: true, required: true })}
                    type="number"
                    min={0}
                    placeholder="Сумма расхода"
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
                />
            </div>

            {/* Кнопка */}
            <button
                type="submit"
                className="w-full bg-secondary text-white py-2 rounded-xl hover:bg-secondary-dark transition-colors"
            >
                Добавить расход
            </button>
        </form>
    )
}
