import { useMemo } from "react";
import { useConvertTypes } from "@/entities/convert";
import { ExpensesFiltersStore } from "../store/ExpensesFilterStore";
import type { StylesConfig } from "react-select";
import type { FilterOption } from "../types/type";


export const useGetFiltersOptions = () => {
    const { convert_types } = useConvertTypes();
    const defaultFilter = ExpensesFiltersStore.getInitialState().convert_type[0];

    const filterOptions = useMemo<FilterOption[]>(() => [
        defaultFilter,
        ...convert_types.map((option) => ({
            value: option.code,
            label: option.title ?? option.code,
        })),
    ], [convert_types, defaultFilter]);

    const selectStyles: StylesConfig<FilterOption, false> = useMemo(() => ({
        container: (base) => ({ ...base, minWidth: 260 }),
        control: (base) => ({ ...base, minHeight: 44, paddingInline: 4 }),
    }), []);

    return { filterOptions, selectStyles };
};
