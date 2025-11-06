import { getDefaultConvertTypeFilter } from "../model/store/ExpensesFilterStore";
import type { FilterOption } from "../model/types/type";

interface Params {
  convert_types: { code: string; title?: string; can_spend?: boolean }[];
  converts?: { type_code?: string }[] | null; 
}

export const getFilterOptions = ({ convert_types, converts }: Params): FilterOption[] => {
  const defaultFilter = getDefaultConvertTypeFilter();
  const seen = new Set<string>();
  const typesWithConverts = new Set<string>();

  (converts ?? []).forEach((convert) => {
    if (typeof convert.type_code === "string" && convert.type_code.length > 0) {
      typesWithConverts.add(convert.type_code);
    }
  });

  const typedOptions: FilterOption[] = convert_types
    .filter(
      (convert) =>
        convert.can_spend &&
        typeof convert.code === "string" &&
        typesWithConverts.has(convert.code)
    )
    .map(({ code, title }) => ({
      value: code,
      label: title ?? code,
    }));

  return [defaultFilter, ...typedOptions].filter(({ value }) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
