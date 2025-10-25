import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ExpensesFiltersState, FilterOption } from "../types/type";

export const getDefaultConvertTypeFilter = (): FilterOption => ({
  value: "all",
  label: "Все",
});

const ExpensesFiltersInitialState: ExpensesFiltersState = {
  convert_type: getDefaultConvertTypeFilter(),
};

export const ExpensesFiltersStore = createSlice({
  name: 'expenses_filters',
  initialState: ExpensesFiltersInitialState,
  reducers: {
    setConvertTypeFilter: (state, action: PayloadAction<FilterOption>) => {
      state.convert_type = action.payload;
    },
    clearConvertType: (state) => {
      state.convert_type = getDefaultConvertTypeFilter();
    },
  },
});

export const { setConvertTypeFilter, clearConvertType } = ExpensesFiltersStore.actions;
export const ExpensesFiltersStoreReducer = ExpensesFiltersStore.reducer;
