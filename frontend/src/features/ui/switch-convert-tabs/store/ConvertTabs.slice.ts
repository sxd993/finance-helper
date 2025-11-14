import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConvertTab } from "@/entities/convert/model/types";

interface SwitchConvertTabsState {
    activeTab: ConvertTab;
}

const initialState: SwitchConvertTabsState = {
    activeTab: "important",
};

export const switchConvertTabsSlice = createSlice({
    name: "switchConvertTabs",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<ConvertTab>) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = switchConvertTabsSlice.actions;
export const switchConvertTabsReducer = switchConvertTabsSlice.reducer;
