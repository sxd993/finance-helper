import { useAddExpenseForm } from "../models/hooks/useAddExpenseForm"

export const AddExpenseForm = () => {
    const { register, onSubmit } = useAddExpenseForm()

    return (
        <form
            onSubmit={onSubmit}
            className="bg-white px-6 py-8 flex flex-col items-center gap-4 rounded-lg w-full border border-slate-200 shadow-lg"
        >
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