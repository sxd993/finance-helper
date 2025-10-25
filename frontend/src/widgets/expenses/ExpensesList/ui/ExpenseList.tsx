import { Error, Loading } from "@/shared/ui/states"
import { useExpensesList } from "../model/hooks/useExpensesList"
import { ExpenseListCard } from "./Card/ExpenseListCard"
import { ExpensesListEmpty } from "./ExpenseListEmpty"
import { ExpensesFilters } from "@features/expenses-filters"

export const ExpensesList = () => {
    const { expenses, expenseGroups, error, isLoading } = useExpensesList()

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
            <ExpensesFilters />
            <div className="flex flex-col gap-3 mt-1">
                {expenseGroups.map(({ dateKey, label, items }) => (
                    <div
                        key={dateKey}
                        className="flex flex-col gap-2 rounded-2xl bg-white overflow-hidden"
                    >
                        <div className=" text-black text-lg text-start">
                            {label}
                        </div>
                        <div className="flex flex-col border-1 border-slate-200 rounded-2xl" >
                            {items.map((expense) => (
                                <ExpenseListCard
                                    key={`${expense.name}-${expense.date}`}
                                    expense={expense}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
