import { formatPrice } from "@/shared/utils/formatPrice";
import type { Convert } from "@/entities/convert";

interface FilterOption {
    value: string;
    label: string;
}

export const getConvertTitleOptions = (
    converts: Convert[] | null,
    convertType: string
): FilterOption[] => {
    if (!converts) return [];

    return converts
        .filter(
            (convert) => convert.type_code === convertType && convert.type?.can_spend
        )
        .map((convert) => ({
            value: String(convert.id),
            label: `${convert.name} (${formatPrice(convert.current_balance)})`,
        }));
};
