import type { ConvertGroup } from "@/entities/convert";
import { formatPrice } from "@/shared/utils/formatPrice";

interface ConvertCardMetrics {
    balance: number;
    limit: number | null;
    usedLimit: number | null;
    remaining: number | null;
    percentage: number | null;
    percentageOfUsedLimit: number | null;
    formattedBalance: string;
    formattedLimit: string;
    formattedUsedLimit: string;
    formattedRemaining: string | null;
    formattedPercentage: string;
    formattedUsedPercentage: string;
}

const clamp = (v: number) => Math.min(Math.max(v, 0), 100);

export const getConvertCardMetrics = (convert: ConvertGroup): ConvertCardMetrics => {
    const balance = convert.currentSum ?? 0;
    const limit = convert.info.convert_type_limit ?? convert.current_convert_limit ?? null;
    const usedLimit = convert.info.used_limit != null ? Number(convert.info.used_limit) : null;

    const percentage = limit ? clamp((balance / limit) * 100) : null;
    const percentageOfUsedLimit = usedLimit ? clamp((balance / usedLimit) * 100) : null;
    const remaining = limit != null ? Math.max(limit - balance, 0) : null;


    return {
        balance,
        limit,
        usedLimit,
        remaining,
        percentage,
        percentageOfUsedLimit,
        formattedBalance: formatPrice(balance),
        formattedLimit: formatPrice(limit),
        formattedUsedLimit: formatPrice(usedLimit),
        formattedRemaining: remaining != null ? formatPrice(remaining) : null,
        formattedPercentage: percentage != null ? `${Math.round(percentage)}%` : "Без лимита",
        formattedUsedPercentage:
            percentageOfUsedLimit != null
                ? `${Math.round(percentageOfUsedLimit)}%`
                : percentage != null
                    ? `${Math.round(percentage)}%`
                    : "Без лимита",
    };
};
