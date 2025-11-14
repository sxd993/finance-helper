import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/shared/ui/Modal/model/modal.slice";
import { ExpensesFiltersStoreReducer } from "@/features/expenses/expenses-filters";
import { switchConvertTabsReducer } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
import { iconPickerReducer } from "@/features/ui/pick-icons/model/iconPicker.slice";
import { replenishFormReducer } from "@/features/converts/replenish-convert/store";

export const rootReducer = combineReducers({
    modal: modalReducer,
    icon_picker: iconPickerReducer,
    expenses_filters: ExpensesFiltersStoreReducer,
    convert_tabs: switchConvertTabsReducer,
    replenish_form: replenishFormReducer,
});
