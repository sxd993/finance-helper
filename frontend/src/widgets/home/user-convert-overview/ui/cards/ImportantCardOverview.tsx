import { CalendarDays } from "lucide-react";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";
import { useConvertCardOverviewMetrics } from "../../model/useConvertCardOverviewMetrics";
import { ProgressBar } from "@/shared/ui/ProgressBar";

interface Props {
    convert: UserConvertLimit;
}

export const ImportantCardOverview = ({ convert }: Props) => {
    const { title, typeCode, remainderAmount, limitAmount, percentage } = useConvertCardOverviewMetrics({ convert });

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow bg-slate-50`}
                        >
                            {renderConvertIcon(typeCode)}
                        </div>
                        <span className="text-gray-900 text-lg">
                            {title}
                        </span>
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
                        color = {'bg-orange-500'}
                        percentage = {percentage}
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
