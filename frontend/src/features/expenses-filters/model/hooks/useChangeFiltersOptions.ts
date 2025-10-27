import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { setConvertTypeFilter } from "@features/expenses-filters";
import type { FilterOption } from "../types/type"
import { getDefaultConvertTypeFilter } from "../store/ExpensesFilterStore";

export const useChangeFiltersOptions = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const defaultFilter = useMemo(() => getDefaultConvertTypeFilter(), []);

    const handleChangeConvertTypeFilter = (selectedOption: FilterOption | null) => {
        dispatch(setConvertTypeFilter(selectedOption ?? defaultFilter));
        queryClient.invalidateQueries({ queryKey: ["expenses"] });

    }

    return { handleChangeConvertTypeFilter }
}
