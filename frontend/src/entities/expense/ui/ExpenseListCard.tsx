import * as LucideIcons from "lucide-react";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { Expense } from "@/entities/expense";

export const ExpenseListCard = ({ expense }: { expense: Expense }) => {
    const Icon = LucideIcons[expense.icon_name as keyof typeof LucideIcons];
    const convertLabel = expense.convert_title ?? expense.convert_type;
    return (
        <div className="flex justify-between items-center w-full p-4 max-w-3xl">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-700">
                        <Icon

                            className={`w-6 h-6 text-[${expense.icon_color}]`} />
                    </div>
                )}
                <div className="flex flex-col justify-between">
                    <span>{expense.name}</span>
                    <span className="text-gray-600 text-sm">{expense.convert_title}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-red-500 text-end">-{formatPrice(expense.sum)}</span>
                <span className="text-gray-600 text-sm">{convertLabel}</span>
            </div>
        </div>
    );
};
