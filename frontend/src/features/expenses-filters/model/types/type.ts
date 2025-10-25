export interface ExpensesFiltersState {
    convert_type: {
        value: string;
        label: string;
    }[];
}


export type FilterOption = {
    value: string;
    label: string;
};