import { createSlice } from "@reduxjs/toolkit"
import type { ExpensesFiltersState } from "../types/type";

const ExpensesFiltersInitialState: ExpensesFiltersState = {
  convert_type: [
    { value: "all", label: "Все" }
  ],
};

export const ExpensesFiltersStore = createSlice({
  name: 'expenses_filters',
  initialState: ExpensesFiltersInitialState,
  reducers: {
    setConvertTypeFilter: (state, action) => {
      state.convert_type = action.payload;
    },
    clearConvertType: (state) => {
      state.convert_type = [
        { value: "all", label: "Все" }
      ];
    },
  },
});

export const { setConvertTypeFilter, clearConvertType } = ExpensesFiltersStore.actions;
export const ExpensesFiltersStoreReducer = ExpensesFiltersStore.reducer;
