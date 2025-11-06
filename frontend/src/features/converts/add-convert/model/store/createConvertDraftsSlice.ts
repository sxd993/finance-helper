import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateConvertPayload } from "../types";

const initialState: CreateConvertPayload[] = [];

export const createConvertDraftsSlice = createSlice({
    name: 'convert',
    initialState,
    reducers: {
        addConvertInStore: (state, action: PayloadAction<CreateConvertPayload>) => {
            state.push(action.payload);
        },
        clearDrafts: (state) => {
            state.length = 0;
        },
        removeDraftsByIndexes: (state, action: PayloadAction<number[]>) => {
            const uniqueSorted = Array.from(new Set(action.payload)).sort((a, b) => b - a);

            uniqueSorted.forEach((index) => {
                if (index >= 0 && index < state.length) {
                    state.splice(index, 1);
                }
            });
        }
    }
});

export const { addConvertInStore, clearDrafts, removeDraftsByIndexes } = createConvertDraftsSlice.actions;
export const createConvertDraftsReducer = createConvertDraftsSlice.reducer;
