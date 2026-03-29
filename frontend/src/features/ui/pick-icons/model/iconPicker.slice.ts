import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { RootState } from "@/app/providers/StoreProvider/config/store"

import {
  DEFAULT_EXPENSE_ICON_NAME,
} from "../const/registry"

type IconPickerState = {
  iconName: string
}

const initialState: IconPickerState = {
  iconName: DEFAULT_EXPENSE_ICON_NAME,
}

const iconPickerSlice = createSlice({
  name: "icon_picker",
  initialState,
  reducers: {
    setIconName(state, action: PayloadAction<string>) {
      state.iconName = action.payload
    },
    resetIconPicker(state, action: PayloadAction<Partial<IconPickerState> | undefined>) {
      state.iconName = action.payload?.iconName ?? DEFAULT_EXPENSE_ICON_NAME
    },
  },
})

export const { setIconName, resetIconPicker } = iconPickerSlice.actions
export const iconPickerReducer = iconPickerSlice.reducer
export const selectIconPickerState = (state: RootState) => state.icon_picker

