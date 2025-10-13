import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/shared/ui/Modal/model/modal.slice";

export const rootReducer = combineReducers({
    modal: modalReducer
});