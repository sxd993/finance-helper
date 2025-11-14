import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ReplenishSourceType } from "../model/types";

interface ReplenishFormState {
  sourceType: ReplenishSourceType | null;
}

const initialState: ReplenishFormState = {
  sourceType: null,
};

const replenishFormSlice = createSlice({
  name: "replenishForm",
  initialState,
  reducers: {
    setSourceType: (state, action: PayloadAction<ReplenishSourceType | null>) => {
      state.sourceType = action.payload;
    },
    resetSourceType: (state) => {
      state.sourceType = null;
    },
  },
});

export const { setSourceType, resetSourceType } = replenishFormSlice.actions;
export const replenishFormReducer = replenishFormSlice.reducer;
