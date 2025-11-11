import { Banknote } from "lucide-react";

export const ExpensesOverview = () => {
    const empty = true

    if (empty) {
        return <></>
    }
    
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Banknote className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-medium text-gray-700">
                    Расход за текущий месяц
                </h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 leading-tight">
                23 500 ₽
            </div>
        </div>
    );
};
