import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { ExpensesOverview, ExpensesList } from "@/widgets/expenses";

export const ExpensesPage = () => {
    useScrollToTop();

    return (
        <div className="flex flex-col max-w-3xl mx-auto pt-5 pb-20 px-4">
            <ExpensesOverview />
            <ExpensesList />
        </div>
    );
};
