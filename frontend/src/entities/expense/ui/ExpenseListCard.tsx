import type { ReactNode } from "react";
import { getConvertTypeColor } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { Expense } from "@/entities/expense";
import { DEFAULT_EXPENSE_ICON_COLOR, ExpenseIcon } from "@/features/ui/pick-icons";

interface ExpenseListCardProps {
    expense: Expense;
    actions?: ReactNode;
}

export const ExpenseListCard = ({ expense, actions }: ExpenseListCardProps) => {
    const {
        text: convertTypeColor,
        bg: convertTypeBackground,
        softBg: convertTypeSoftBackground,
    } = getConvertTypeColor(expense.convert_type);

    return (
        <div className="flex w-full max-w-3xl items-start justify-between gap-4 p-4">
            <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50">
                        <ExpenseIcon
                            name={expense.icon_name}
                            className="h-5 w-5"
                            color={DEFAULT_EXPENSE_ICON_COLOR}
                        />
                    </div>
                    <span className="truncate text-[15px] font-medium leading-5 text-slate-900">
                        {expense.name}
                    </span>
                </div>
                <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 ${convertTypeSoftBackground}`}
                >
                    <span className={`h-2 w-2 rounded-full ${convertTypeBackground}`} />
                    <span className={`text-xs font-medium ${convertTypeColor}`}>{expense.convert_title}</span>
                </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
                {actions}
                <span className="text-end text-lg font-semibold leading-none text-red-500">
                    -{formatPrice(expense.sum)}
                </span>
            </div>
        </div>
    );
};
