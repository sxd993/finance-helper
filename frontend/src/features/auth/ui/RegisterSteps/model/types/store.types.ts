import type { RegisterStep } from "@/features/auth/model/types/auth.types";

export interface RegisterStepStoreState {
  step: RegisterStep;
  setStep: (step: RegisterStep) => void;
  reset: () => void;
}