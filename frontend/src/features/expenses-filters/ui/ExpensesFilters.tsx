
import Select from "react-select"
import { useGetFiltersOptions } from "@features/expenses-filters/model"
import { useChangeFiltersOptions } from "@features/expenses-filters/model";


export const ExpensesFilters = () => {
    const { filterOptions, selectStyles } = useGetFiltersOptions();
    const { handleChangeConvertTypeFilter } = useChangeFiltersOptions();

    if (!filterOptions.length) {
        return null
    }

    return (
        <div className="flex justify-center mt-4 mb-2">
            <Select
                defaultValue={filterOptions[0]}
                placeholder="Типы конвертов"
                name="filters"
                options={filterOptions}
                className="select"
                classNamePrefix="select"
                styles={selectStyles}
                onChange={(e) => handleChangeConvertTypeFilter(e)}
            />
        </div>
    )
}
