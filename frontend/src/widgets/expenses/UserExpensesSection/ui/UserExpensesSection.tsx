import { ExpensesFilters } from "@/features/expenses/expenses-filters"
import { UserExpensesList } from "@/features/expenses/get-user-expenses/ui/UserExpensesList"

export const UserExpensesSection = () => {
    return (
        <div className="flex flex-col gap-5 mt-1">
            <ExpensesFilters />
            <UserExpensesList />
        </div>
    )
}
