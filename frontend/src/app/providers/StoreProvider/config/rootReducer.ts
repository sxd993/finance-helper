import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/shared/ui/Modal/model/modal.slice";
import { createConvertDraftsReducer } from "@/features/add-converts/model/store/createConvertDraftsSlice";

export const rootReducer = combineReducers({
    modal: modalReducer,
    converts_drafts: createConvertDraftsReducer
});