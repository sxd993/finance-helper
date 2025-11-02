import type { ConvertGroup } from "@/entities/convert";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { getConvertCardMetrics } from "../../lib/getConvertCardMetrics";
import { CalendarDays } from "lucide-react";

interface Props {
    convert: ConvertGroup;
}


export const WishesCardOverview = ({ convert }: Props) => {
    const metrics = getConvertCardMetrics(convert);
    const progress = metrics.percentageOfUsedLimit ?? metrics.percentage ?? 0;
    const limitLabel = convert.info.is_reset
        ? "Обновится через 5 дн."
        : metrics.limit != null
            ? metrics.formattedPercentage
            : "Нет цели";


    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow bg-slate-50`}
                        >
                            {renderConvertIcon(convert.code)}
                        </div>
                        <span className="text-gray-900 text-lg">
                            {convert.info.title}
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Остаток</p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {metrics.formattedBalance}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Лимит</p>
                                <p className="text-gray-900 text-sm">{metrics.formattedUsedLimit}</p>
                            </div>
                        </div>

                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-yellow-500 rounded-full transition-[width] duration-700 ease-in-out shadow-sm`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 gap-2">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                                {metrics.formattedUsedPercentage}
                            </span>
                            <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                {limitLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
