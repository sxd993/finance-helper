import type { FilterOption } from "@/features/expenses-filters/model/types/type";
import type { ConvertGroup } from "@/entities/convert/model/types";

export const getConvertTypeOptions = (convertOverview: ConvertGroup[] | null): FilterOption[] => {
    if (!convertOverview) return [];

    return convertOverview
        .filter((group) => group.info?.can_spend)
        .map((convert) => ({
            value: convert.info?.code ?? "",
            label: convert.info?.title ?? convert.info?.code ?? "",
        }));
};
