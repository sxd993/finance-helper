import { useUserExpenses } from "@/features/expenses/get-user-expenses/model/useUserExpenses";

export const ExpensesOverview = () => {
    const { currentCycleSpent } = useUserExpenses();
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center">
                <h3 className="text-base font-medium text-gray-700">
                    Расход за текущий месяц
                </h3>
            </div>
            <div className="text-2xl font-semibold text-gray-900 leading-tight">
                {currentCycleSpent}
            </div>
        </div>
    );
};
