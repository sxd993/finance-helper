import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ExpensesOverview } from '@/widgets/expenses';
import { ExpensesList } from "@/widgets/expenses";

export const ExpensesPage = () => {
    useScrollToTop();
    return (
        <div className="flex flex-col gap-10 max-w-3xl mx-auto pt-5 pb-20">
            <ExpensesOverview />
            <ExpensesList />
        </div>
    );
}
