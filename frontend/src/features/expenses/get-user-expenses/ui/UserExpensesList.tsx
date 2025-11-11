import { ExpenseListCard } from "@entities/expense"
import { Error, Loading } from "@/shared/ui/states"
import { useUserExpenses } from "../model/useUserExpenses"
import { UserExpensesListEmpty } from "./states/UserExpensesListEmpty"

export const UserExpensesList = () => {
    const { expenseGroups, isLoading, error } = useUserExpenses()

    if (isLoading) return <Loading title="Загрузка расходов..." />
    if (error) return <Error error_name="Ошибка при загрузке расходов" />
    const isEmpty = expenseGroups.length === 0

    if (isEmpty) {
        return <UserExpensesListEmpty/>
    }

    return (
        <div className="flex flex-col gap-3">
            {expenseGroups.map(({ label, items }) => (
                <div key={label} className="flex flex-col gap-2 rounded-2xl overflow-hidden">
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
