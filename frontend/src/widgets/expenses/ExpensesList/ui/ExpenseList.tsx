import { Error, Loading } from "@/shared/ui/states"
import { useExpensesList } from "../model/hooks/useExpensesList"
import { ExpenseListCard } from "./Card/ExpenseListCard"
import { ExpensesListEmpty } from "./ExpenseListEmpty"
import { ExpenseListFilters } from "./Filters/ExpenseListFilters"

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
        <>
            <ExpenseListFilters />
            <div className="flex flex-col divide-y divide-gray-100 rounded-2xl bg-white shadow-sm mt-1">
                {expenses.map((expense) => (
                    <ExpenseListCard
                        key={`${expense.name}-${expense.date}`}
                        expense={expense}
                    />
                ))}
            </div>
        </>
    )
}
