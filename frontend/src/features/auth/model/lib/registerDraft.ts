import type { RegisterFormData, RegisterStep } from "../types/auth.types";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export interface RegisterDraft {
  step?: RegisterStep;
  onboardingStep?: OnboardingStep;
  values?: Partial<RegisterFormData>;
}

export const REGISTER_DRAFT_STORAGE_KEY = "finance-helper:register-draft";

const isBrowser = () => typeof window !== "undefined";

const isRegisterStep = (value: unknown): value is RegisterStep =>
  value === "userInfo" || value === "userOnboarding" || value === "userSettings";

const isOnboardingStep = (value: unknown): value is OnboardingStep =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;

export const readRegisterDraft = (): RegisterDraft | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawDraft = window.sessionStorage.getItem(REGISTER_DRAFT_STORAGE_KEY);
    if (!rawDraft) {
      return null;
    }

    const parsed = JSON.parse(rawDraft) as RegisterDraft;

    return {
      step: isRegisterStep(parsed.step) ? parsed.step : undefined,
      onboardingStep: isOnboardingStep(parsed.onboardingStep)
        ? parsed.onboardingStep
        : undefined,
      values: parsed.values && typeof parsed.values === "object" ? parsed.values : undefined,
    };
  } catch {
    window.sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
    return null;
  }
};

export const writeRegisterDraft = (draft: RegisterDraft) => {
  if (!isBrowser()) {
    return;
  }

  const nextDraft = {
    ...readRegisterDraft(),
    ...draft,
  };

  window.sessionStorage.setItem(REGISTER_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
};

export const clearRegisterDraft = () => {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(REGISTER_DRAFT_STORAGE_KEY);
};
