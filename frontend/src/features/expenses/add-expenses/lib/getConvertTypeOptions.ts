import type { FilterOption } from "@/features/expenses/expenses-filters/model/types/type";
import type { ConvertGroup } from "@/entities/convert/model/types";
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types";

export const getConvertTypeOptions = (convert_limits: UserConvertLimit | null): FilterOption[] => {
    if (!convert_limits) return [];

    return c
};
