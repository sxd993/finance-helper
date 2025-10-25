import { ExpensesFilters } from "@/features/expenses-filters";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { Button } from "@/shared/ui/Button";
import { ExpensesOverview, ExpensesList } from "@/widgets/expenses";
import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

export const ExpensesPage = () => {
    useScrollToTop();

    return (
        <div className="flex flex-col max-w-3xl mx-auto pt-5 pb-20 px-4">
            <ExpensesOverview />
            <div className="flex justify-between items-center mt-4 mb-4 p-4">
                <ExpensesFilters />
                <NavLink to={"add-expense"}>
                    <Button
                        size="sm"
                        leftIcon={<Plus />}
                        title="Добавить транзакцию"
                    />
                </NavLink>
            </div>
            <ExpensesList />
        </div>
    );
};
