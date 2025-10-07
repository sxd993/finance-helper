import { useAddIncomeForm } from "../model/useAddIncomeForm"

export const AddIncomeForm = () => {
    const { form, onSubmit } = useAddIncomeForm()

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 w-full max-w-sm mx-auto"
        >
            {/* Поле "Название дохода" */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Название</label>
                <input
                    type="text"
                    {...form.register("title", { required: "Введите название дохода" })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Например: Зарплата"
                />
                {form.formState.errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.title.message}
                    </p>
                )}
            </div>

            {/* Поле "Сумма" */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Сумма</label>
                <input
                    type="number"
                    {...form.register("amount", {
                        required: "Введите сумму",
                        valueAsNumber: true,
                        min: { value: 1, message: "Сумма должна быть больше 0" },
                    })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="0.00"
                />
                {form.formState.errors.amount && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.amount.message}
                    </p>
                )}
            </div>

            {/* Кнопка отправки */}
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
                Добавить доход
            </button>
        </form>
    )
}
