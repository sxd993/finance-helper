import { ExpensesFilters } from "@/features/expenses/expenses-filters"
import { useUserExpenses } from "@/features/expenses/get-user-expenses/model/useUserExpenses"
import { UserExpensesList } from "@/features/expenses/get-user-expenses/ui/UserExpensesList"
import { UserExpensesSectionEmpty } from "./states/UserExpensesSectionEmpty"

export const UserExpensesSection = () => {
    const { expenses } = useUserExpenses()
    if (!expenses.length) return <UserExpensesSectionEmpty />

    return (
        <div className="flex flex-col gap-3 mt-1">
            <ExpensesFilters />
            <UserExpensesList />
        </div>
    )
}
