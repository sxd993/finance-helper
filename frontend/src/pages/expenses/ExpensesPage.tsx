import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { Button } from "@/shared/ui/Button";
import { SectionTitle } from "@/shared/ui/SectionTItle";
import { ExpensesOverview, UserExpensesList } from "@/widgets/expenses";
import { Plus, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ExpensesPage = () => {
    useScrollToTop();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col max-w-3xl mx-auto pt-5 pb-20 px-4">
            <ExpensesOverview />
            <div className="flex justify-between items-center gap-4 p-2">
                <SectionTitle
                    title="Ваши транзакции"
                    subtitle="Управляйте своими финансовыми целями"
                    icon={<Banknote className="w-6 h-6 text-primary" />}
                />
                <Button
                    onClick={() => { navigate('add-expense') }}
                    size='sm'
                    bg="secondary"
                    leftIcon={<Plus />}
                    className="justify-center items-center flex"
                />
            </div>
            <UserExpensesList />
        </div>
    );
};
