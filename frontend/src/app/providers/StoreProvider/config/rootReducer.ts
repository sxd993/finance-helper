import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/shared/ui/Modal/model/modal.slice";
import { createConvertDraftsReducer } from "@/features/add-converts";
import { ExpensesFiltersStoreReducer } from "@/features/expenses-filters";

export const rootReducer = combineReducers({
    modal: modalReducer,
    create_converts_drafts: createConvertDraftsReducer,
    expenses_filters: ExpensesFiltersStoreReducer,
});