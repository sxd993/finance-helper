import { AddExpenseForm } from "@/features/expenses/add-expenses/ui/AddExpenseForm";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop"
import { PageFormHeader } from "@/shared/ui/PageFormHeader";
import { BanknoteArrowDown } from "lucide-react";

export const AddExpensesPage = () => {
    useScrollToTop();
    return (
        <div className="app-page-container">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                <PageFormHeader
                    title="Добавить расход"
                    icon={<BanknoteArrowDown className="h-6 w-6" />}
                />
                <div className="w-full">
                    <AddExpenseForm />
                </div>
            </div>
        </div>
    )
}
