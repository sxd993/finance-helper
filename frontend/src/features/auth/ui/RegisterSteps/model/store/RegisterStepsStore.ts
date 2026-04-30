import { create } from 'zustand';
import type { RegisterStep } from '@features/auth/model/types/auth.types';
import {
  readRegisterDraft,
  writeRegisterDraft,
  type OnboardingStep,
} from '@/features/auth/model/lib/registerDraft';

interface RegisterStepsState {
  step: RegisterStep;
  onboardingStep: OnboardingStep;
  setStep: (step: RegisterStep | ((prev: RegisterStep) => RegisterStep)) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  reset: () => void;
}

const draft = readRegisterDraft();

export const useRegisterStepsStore = create<RegisterStepsState>((set) => ({
  step: draft?.step ?? 'userInfo',
  onboardingStep: draft?.onboardingStep ?? 1,
  setStep: (step) =>
    set((state) => ({
      step: (() => {
        const nextStep = typeof step === 'function' ? step(state.step) : step;
        writeRegisterDraft({ step: nextStep });
        return nextStep;
      })(),
    })),
  setOnboardingStep: (onboardingStep) => {
    writeRegisterDraft({ onboardingStep });
    set({ onboardingStep });
  },
  reset: () => set({ step: 'userInfo', onboardingStep: 1 }),
}));
