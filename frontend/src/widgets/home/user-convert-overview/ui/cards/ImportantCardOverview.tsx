import type { ConvertGroup } from "@/entities/convert";
import { getConvertCardMetrics } from "../../lib/getConvertCardMetrics";
import { getCardVariant } from "../../model/convertCardVariants";
import { Calendar } from "lucide-react";

interface Props {
    convert: ConvertGroup;
}

export const ImportantCardOverview = ({ convert }: Props) => {
    const styles = getCardVariant("important");
    const metrics = getConvertCardMetrics(convert);
    const Icon = styles.Icon;

    const progress =
        metrics.percentageOfUsedLimit ?? metrics.percentage ?? 0;
    const limitLabel = convert.info.is_reset
        ? "Обновится через 5 дн."
        : metrics.limit != null
            ? metrics.formattedPercentage
            : "Нет цели";

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                            >
                                <Icon className={`w-6 h-6 ${styles.iconColor}`} />
                            </div>
                            <span className="text-gray-900 text-xl">
                                {convert.info.title}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-md text-black mb-1">Остаток</p>
                                <p className="text-black text-xl">{metrics.formattedBalance}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-md text-black mb-1">Лимит</p>
                                <p className="text-black">{metrics.formattedUsedLimit}</p>
                            </div>
                        </div>

                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full ${styles.progressColor} rounded-full transition-all duration-500 shadow-sm`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span
                                className={` bg-slate-100 px-2 py-1 rounded-md font-medium text-[14px]`}
                            >
                                {metrics.formattedUsedPercentage}
                            </span>
                            <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md flex gap-1">
                                <Calendar className="w-4 h-4" />
                                {limitLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
