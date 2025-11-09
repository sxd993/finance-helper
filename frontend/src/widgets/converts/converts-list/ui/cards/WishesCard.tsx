import type { Convert } from "@/entities/convert/model/types";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { formatPrice } from "@/shared/utils/formatPrice";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { CalendarDays } from "lucide-react";

interface Props {
    convert: Convert;
}

export const WishesCard = ({ convert }: Props) => {
    const typeCode = convert.type_code;
    const remainderAmount = formatPrice(convert.current_balance);
    const limitAmount = formatPrice(convert.target_amount);
    const percentage = convert.target_amount
        ? Math.min(100, Math.max(0, Math.round((convert.current_balance / convert.target_amount) * 100)))
        : 0;

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow bg-slate-50">
                            {renderConvertIcon(typeCode)}
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Желания</p>
                            <span className="text-gray-900 text-lg font-semibold">
                                {convert.name}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Остаток</p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {remainderAmount}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Лимит</p>
                                <p className="text-gray-900 text-sm">{limitAmount}</p>
                            </div>
                        </div>

                        <ProgressBar
                            color="bg-yellow-500"
                            percentage={percentage}
                        />

                        <div className="flex items-center justify-between text-xs pt-1 gap-2">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                {percentage}%
                            </span>
                            <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                Сброс через 5 дней
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
