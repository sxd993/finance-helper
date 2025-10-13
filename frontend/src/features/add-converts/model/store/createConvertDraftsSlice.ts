import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateConvertPayload } from "@/features/add-converts/model/types/addConvertPayload.type";

const initialState: CreateConvertPayload[] = [];

export const createConvertDraftsSlice = createSlice({
    name: 'convert',
    initialState,
    reducers: {
        addConvertInStore: (state, action: PayloadAction<CreateConvertPayload>) => {
            state.push(action.payload);
        }
    }
});

export const { addConvertInStore } = createConvertDraftsSlice.actions;
export const createConvertDraftsReducer = createConvertDraftsSlice.reducer;
