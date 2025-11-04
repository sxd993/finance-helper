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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 mb-4 gap-3">
                <ExpensesFilters />
                <NavLink to={"add-expense"} className="w-full md:w-auto">
                    <Button
                        size="md"
                        leftIcon={<Plus />}
                        title="Добавить транзакцию"
                        className="w-full md:w-auto justify-center items-center flex"
                    />
                </NavLink>
            </div>
            <ExpensesList />
        </div>
    );
};
