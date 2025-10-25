import { useMemo } from "react";
import { useConvertTypes } from "@/entities/convert";
import { getDefaultConvertTypeFilter } from "../store/ExpensesFilterStore";
import type { StylesConfig } from "react-select";
import type { FilterOption } from "../types/type";

export const useGetFiltersOptions = () => {
  const { convert_types } = useConvertTypes();

  const filterOptions = useMemo<FilterOption[]>(() => {
    const defaultFilter = getDefaultConvertTypeFilter();
    const seen = new Set<string>();

    return [
      defaultFilter,
      ...convert_types.map(({ code, title }) => ({
        value: code,
        label: title ?? code,
      })),
    ].filter(({ value }) => !seen.has(value) && seen.add(value));
  }, [convert_types]);

  const selectStyles: StylesConfig<FilterOption, false> = useMemo(
    () => ({
      container: (base) => ({ ...base, minWidth: 260 }),
      control: (base) => ({ ...base, minHeight: 44, paddingInline: 4 }),
    }),
    []
  );

  return { filterOptions, selectStyles };
};
