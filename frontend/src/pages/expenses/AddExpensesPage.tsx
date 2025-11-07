import { AddExpenseForm } from "@/features/expenses/add-expenses/ui/AddExpenseForm";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop"

export const AddExpensesPage = () => {
    useScrollToTop();
    return (
        <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20 justify-center items-center">
            <AddExpenseForm/>
        </div>
    )
}
