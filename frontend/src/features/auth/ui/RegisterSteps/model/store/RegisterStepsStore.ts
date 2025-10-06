import { create } from 'zustand';
import type { RegisterStep } from '@features/auth/model/types/auth.types';

interface RegisterStepsState {
  step: RegisterStep;
  setStep: (step: RegisterStep | ((prev: RegisterStep) => RegisterStep)) => void;
  reset: () => void;
}

export const useRegisterStepsStore = create<RegisterStepsState>((set) => ({
  step: 'userInfo',
  setStep: (step) =>
    set((state) => ({
      step: typeof step === 'function' ? step(state.step) : step,
    })),
  reset: () => set({ step: 'userInfo' }),
}));
