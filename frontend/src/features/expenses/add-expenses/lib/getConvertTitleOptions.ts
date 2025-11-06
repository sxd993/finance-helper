import { formatPrice } from "@/shared/utils/formatPrice";
import type { FilterOption } from "@/features/expenses/expenses-filters/model/types/type";
import type { Convert } from "@/entities/convert";

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
            value: convert.name,
            label: `${convert.name} (${formatPrice(convert.current_balance)})`,
        }));
};
