import { useState } from "react"

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export const useSwitchOnboardingCards = () => {
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
    const maxStep: OnboardingStep = 5;
    const minStep: OnboardingStep = 1;

    const handleNextCard = () => {
        setOnboardingStep((prev) => (prev < maxStep ? ((prev + 1) as OnboardingStep) : prev));
    };

    const handlePrevCard = () => {
        setOnboardingStep((prev) => (prev > minStep ? ((prev - 1) as OnboardingStep) : prev));
    };

    return { onboardingStep, setOnboardingStep, handleNextCard, handlePrevCard };
};
