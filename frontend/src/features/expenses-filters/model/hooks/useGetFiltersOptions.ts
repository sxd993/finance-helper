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

    const typedOptions: FilterOption[] = convert_types
      .filter(({ can_spend }) => can_spend)
      .map(({ code, title }) => ({
        value: code,
        label: title ?? code,
      }));

    return [defaultFilter, ...typedOptions].filter(({ value }) => {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
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
