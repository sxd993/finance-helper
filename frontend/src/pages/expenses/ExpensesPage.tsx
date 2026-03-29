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
        <div className="flex flex-col max-w-3xl mx-auto pt-5 pb-20 px-4 gap-5">
            <ExpensesOverview />
            <div className="flex items-center justify-between gap-4">
                <SectionTitle
                    title="Ваши расходы"
                    subtitle="Управляйте своими финансовыми целями"
                    icon={<Banknote className="w-6 h-6 text-primary" />}
                />
                <Button
                    onClick={() => { navigate('add-expense') }}
                    title="Добавить"
                    bg="secondary"
                    size="sm"
                    leftIcon={<Plus width={18} height={18} />}
                    className="shrink-0 gap-2 px-4 py-2.5 shadow-sm"
                />
            </div>
            <UserExpensesList  />
        </div>
    );
};
