import * as LucideIcons from "lucide-react";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { Expense } from "@/entities/expense";

export const ExpenseListCard = ({ expense }: { expense: Expense }) => {
    const Icon = LucideIcons[expense.icon_name as keyof typeof LucideIcons];
    return (
        <div className="flex justify-between items-center w-full p-4 max-w-3xl">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Icon
                            className="w-6 h-6"
                            style={{ color: expense.icon_color }} />
                    </div>
                )}
                <div className="flex flex-col justify-between">
                    <span>{expense.name}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-red-500 text-end">-{formatPrice(expense.sum)}</span>
                <span className="text-gray-600 text-sm">{expense.convert_title}</span>
            </div>
        </div>
    );
};
