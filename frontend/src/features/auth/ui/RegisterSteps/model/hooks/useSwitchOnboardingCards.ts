import type { OnboardingStep } from "@/features/auth/model/lib/registerDraft";
import { useRegisterStepsStore } from "../store/RegisterStepsStore";

export const useSwitchOnboardingCards = () => {
    const { onboardingStep, setOnboardingStep } = useRegisterStepsStore();
    const maxStep: OnboardingStep = 5;
    const minStep: OnboardingStep = 1;

    const handleNextCard = () => {
        setOnboardingStep(onboardingStep < maxStep ? ((onboardingStep + 1) as OnboardingStep) : onboardingStep);
    };

    const handlePrevCard = () => {
        setOnboardingStep(onboardingStep > minStep ? ((onboardingStep - 1) as OnboardingStep) : onboardingStep);
    };

    return { onboardingStep, setOnboardingStep, handleNextCard, handlePrevCard };
};
