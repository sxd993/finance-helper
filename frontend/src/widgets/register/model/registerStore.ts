import { create } from 'zustand';
import type { RegisterStep } from '@features/auth/model/registerTypes';

interface RegisterStoreState {
  step: RegisterStep;
  setStep: (step: RegisterStep) => void;
  reset: () => void;
}

export const useRegisterStore = create<RegisterStoreState>((set) => ({
  step: 'userInfo',
  setStep: (step) => set({ step }),
  reset: () => set({ step: 'userInfo' }),
}));
