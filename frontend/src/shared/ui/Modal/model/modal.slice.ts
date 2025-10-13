import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  [key: string]: boolean;
}

const initialState: ModalState = {
    
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { openModal, closeModal, toggleModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
