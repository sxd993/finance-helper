import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/shared/ui/Modal/model/modal.slice";
import { createConvertDraftsReducer } from "@/features/converts/add-convert";
import { ExpensesFiltersStoreReducer } from "@/features/expenses/expenses-filters";
import { switchConvertTabsReducer } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
import { iconPickerReducer } from "@/features/ui/pick-icons/model/iconPicker.slice";

export const rootReducer = combineReducers({
    modal: modalReducer,
    icon_picker: iconPickerReducer,
    create_converts_drafts: createConvertDraftsReducer,
    expenses_filters: ExpensesFiltersStoreReducer,
    convert_tabs: switchConvertTabsReducer
});
