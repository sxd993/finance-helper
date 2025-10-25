import { useScrollToTop } from "@/shared/hooks/useScrollToTop"
import { AddExpenseForm } from "@/features/add-expense";

export const AddExpensesPage = () => {
    useScrollToTop();
    return (
        <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
            <AddExpenseForm/>
        </div>
    )
}
