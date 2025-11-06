import type { StylesConfig } from "react-select";
import type { FilterOption } from "../model/types/type";

export const getSelectStyles = (): StylesConfig<FilterOption, false> => ({
    container: (base) => ({ ...base, minWidth: 260 }),
    control: (base) => ({ ...base, minHeight: 44, paddingInline: 4 }),
});
