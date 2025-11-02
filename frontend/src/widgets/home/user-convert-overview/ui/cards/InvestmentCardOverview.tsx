import type { ConvertGroup } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";
import { getCardVariant } from "../../model/convertCardVariants";

interface Props {
    convert: ConvertGroup;
}


export const InvestmentCardOverview = ({ convert }: Props) => {
    const styles = getCardVariant("investment");
    const balance = convert.currentSum ?? 0;
    const limit =
        convert.info.convert_type_limit ??
        convert.current_convert_limit ??
        null;

    const formattedBalance = formatPrice(balance) ?? "—";
    const formattedLimit = limit != null ? formatPrice(limit) ?? "—" : "—";

    const Icon = styles.Icon;

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                            >
                                <Icon className={`w-6 h-6 ${styles.iconColor}`} />
                            </div>
                            <span className="text-gray-900 font-semibold">
                                {convert.info.title}
                            </span>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-sm text-gray-500">Портфель</span>
                            <span className="text-2xl font-semibold text-gray-900">
                                {formattedBalance}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Цель</p>
                            <p className="text-gray-700">{formattedLimit}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                                Режим средств
                            </p>
                            <p className="text-gray-700">
                                {convert.info.can_spend
                                    ? "Можно выводить"
                                    : "Накапливаем"}
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md inline-flex">
                        Инвестируйте регулярно, чтобы достичь цели быстрее
                    </div>
                </div>
            </div>
        </div>
    );
};
