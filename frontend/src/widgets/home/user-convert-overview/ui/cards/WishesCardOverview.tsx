import type { ConvertGroup } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";
import { getCardVariant } from "../../model/convertCardVariants";

interface Props {
    convert: ConvertGroup;
}


export const WishesCardOverview = ({ convert }: Props) => {
    const styles = getCardVariant("wishes");
    const balance = convert.currentSum ?? 0;
    const limit =
        convert.info.convert_type_limit ??
        convert.current_convert_limit ??
        null;
    const percentage =
        limit && limit > 0 ? Math.min((balance / limit) * 100, 100) : null;
    const remaining = limit != null ? Math.max(limit - balance, 0) : null;

    const formattedBalance = formatPrice(balance) ?? "—";
    const formattedLimit = limit != null ? formatPrice(limit) ?? "—" : "—";
    const formattedRemaining =
        remaining != null ? formatPrice(remaining) ?? "—" : null;

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
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-semibold">
                                    {convert.info.title}
                                </span>
                                {limit != null && (
                                    <span className="text-xs text-gray-500">
                                        Лимит установлен
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-sm text-gray-500">Остаток</span>
                            <span className="text-2xl font-semibold text-gray-900">
                                {formattedBalance}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Общая сумма</p>
                            <p className="text-gray-700">{formattedLimit}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                                Доступно к распределению
                            </p>
                            <p className="text-gray-700">
                                {formattedRemaining ?? "Без лимита"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full ${styles.progressColor} rounded-full transition-all duration-500 shadow-sm`}
                                style={{
                                    width: `${
                                        percentage != null ? percentage : 100
                                    }%`,
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span
                                className={`${styles.badgeText} ${styles.badgeBg} px-2 py-1 rounded-md font-medium`}
                            >
                                {percentage != null
                                    ? `${Math.round(percentage)}%`
                                    : "Без лимита"}
                            </span>
                            {convert.info.is_reset ? (
                                <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
                                    Лимит обновляется
                                </span>
                            ) : (
                                <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
                                    {formattedRemaining
                                        ? `${formattedRemaining} до цели`
                                        : "Нет цели"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
