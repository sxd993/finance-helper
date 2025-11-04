import type { ConvertGroup } from "@/entities/convert";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { formatPrice } from "@/shared/utils/formatPrice";

interface Props {
    convert: ConvertGroup;
}

export const InvestmentCardOverview = ({ convert }: Props) => {
    const current = convert.info.used_limit ?? 0;
    const invested = convert.currentSum ?? 0;

    const absoluteReturn = current - invested;
    const percent = invested > 0 ? (absoluteReturn / invested) * 100 : 0;

    const color =
        absoluteReturn > 0
            ? "text-emerald-600"
            : absoluteReturn < 0
                ? "text-rose-600"
                : "text-slate-600";


    const percentage = `${percent.toFixed(2)}%`

    console.log(convert)


    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-5">
                    {/* Заголовок */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            {renderConvertIcon(convert.code)}
                        </div>
                        <span className="text-gray-900 text-lg font-medium">
                            {convert.info.title}
                        </span>
                    </div>

                    {/* Значения */}
                    <div className="space-y-3 flex justify-between">
                        <div className="flex flex-col items-start justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                                    Текущая стоимость портфеля
                                </p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {formatPrice(current)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                                    Вложено:
                                </p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {formatPrice(invested)}
                                </p>
                            </div>
                        </div>
                        {/* P/L */}
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                            <span className={color}>{formatPrice(absoluteReturn)}</span>
                            <span className="text-slate-300">•</span>
                            <span className={color}>{percentage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
