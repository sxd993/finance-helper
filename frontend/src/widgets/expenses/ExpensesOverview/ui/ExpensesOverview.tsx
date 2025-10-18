import { Banknote } from "lucide-react"

export const ExpensesOverview = () => {
    return (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Banknote className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                    Расход за текущую неделю
                </h3>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
                23 500 ₽
            </div>
        </div>
    )
}
