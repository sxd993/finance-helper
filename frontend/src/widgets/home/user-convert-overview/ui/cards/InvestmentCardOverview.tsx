import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";
import { useConvertCardOverviewMetrics } from "../../model/useConvertCardOverviewMetrics";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";

interface Props {
    convert: UserConvertLimit;
}

export const InvestmentCardOverview = ({ convert }: Props) => {
    const { title, typeCode, color, percentage, absoluteReturn, limitAmount, distributedAmount } = useConvertCardOverviewMetrics({ convert });

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-5">
                    {/* Заголовок */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            {renderConvertIcon(typeCode)}
                        </div>
                        <span className="text-gray-900 text-lg font-medium">
                            {title}
                        </span>
                    </div>

                    {/* Значения */}
                    <div className="space-y-3 flex justify-between">
                        <div className="flex flex-col items-start justify-between">
                            <div>
                                <p className="text-xs tracking-wide text-slate-500 mb-1">
                                    В этом месяце вы можете пополнить портфели на:
                                </p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {limitAmount}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                                    В этом месяце вы пополнили портфели на:
                                </p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {distributedAmount}
                                </p>
                            </div>
                            <div>
                                стоимость портфеля
                            </div>
                            <div>
                                изначальная сумма вложений
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
