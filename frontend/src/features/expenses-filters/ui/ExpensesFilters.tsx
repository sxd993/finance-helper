
import Select from "react-select"
import { useSelector } from "react-redux";
import { useGetFiltersOptions } from "@features/expenses-filters/model"
import { useChangeFiltersOptions } from "@features/expenses-filters/model";
import type { RootState } from "@/app/providers";


export const ExpensesFilters = () => {
    const { filterOptions, selectStyles } = useGetFiltersOptions();
    const { handleChangeConvertTypeFilter } = useChangeFiltersOptions();
    const selectedFilter = useSelector((state: RootState) => state.expenses_filters.convert_type);

    if (!filterOptions.length) {
        return null
    }

    return (
        <div className="flex justify-center mt-4 mb-2">
            <Select
                placeholder="Типы конвертов"
                name="filters"
                options={filterOptions}
                value={selectedFilter}
                className="select"
                classNamePrefix="select"
                styles={selectStyles}
                onChange={handleChangeConvertTypeFilter}
            />
        </div>
    )
}
