import { Error, Loading } from "@/shared/ui/states"
import { useExpensesList } from "../model/hooks/useExpensesList"
import { ExpenseListCard } from "@entities/expense"
import { ExpensesListEmpty } from "./states/ExpenseListEmpty"

export const ExpensesList = () => {
    const { expenses, expenseGroups, error, isLoading } = useExpensesList()

    if (isLoading) return <Loading title="Загрузка расходов..." />
    if (error) return <Error error_name="Ошибка при загрузке расходов" />
    if (!expenses.length) return <ExpensesListEmpty />

    return (
        <div className="flex flex-col gap-3 mt-1">
            {expenseGroups.map(({ label, items }) => (
                <div key={label} className="flex flex-col gap-2 rounded-2xl  overflow-hidden">
                    <div className="text-black text-lg text-start">{label}</div>
                    <div className="flex flex-col border border-slate-200 rounded-2xl bg-white">
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
    )
}
