import type { FilterOption } from "../types/type"
import { useDispatch } from "react-redux";
import { setConvertTypeFilter } from "@features/expenses-filters";

export const useChangeFiltersOptions = () => {
    const dispatch = useDispatch();

    const handleChangeConvertTypeFilter = (selectedOption: FilterOption) => {
        dispatch(setConvertTypeFilter(selectedOption));
    }

    return { handleChangeConvertTypeFilter }
}