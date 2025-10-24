import { Error, Loading } from "@/shared/ui/states"
import { useExpensesList } from "../../model/hooks/useExpensesList"
import { ExpenseCard } from "../Card/ExpenseCard"
import { ExpensesListEmpty } from "./ExpenseListEmpty"

export const ExpensesList = () => {
    const { expenses, error, isLoading } = useExpensesList()

    if (isLoading) {
        return <Loading title="Загрузка расходов..." />
    }

    if (error) {
        return <Error error_name="Ошибка при загрузке расходов" />
    }

    if (!expenses.length) {
        return <ExpensesListEmpty />
    }

    return (
        <div className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white shadow-sm">
            {expenses.map((expense) => (
                <ExpenseCard
                    key={`${expense.name}-${expense.date}`}
                    expense={expense}
                />
            ))}
        </div>
    )
}
