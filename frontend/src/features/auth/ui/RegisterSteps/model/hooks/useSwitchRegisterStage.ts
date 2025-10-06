import { useEffect, useCallback } from "react";
import { useRegisterStepsStore } from "../store/RegisterStepsStore";
import type { RegisterStep } from "@/features/auth/model/types/auth.types";

export const useSwitchRegisterStage = () => {
    const { step, setStep, reset } = useRegisterStepsStore();

    // выносим в useCallback для мемоизации
    const onNext = useCallback(() => {
        setStep((prev: RegisterStep) => {
            if (prev === "userInfo") return "userOnboarding";
            if (prev === "userOnboarding") return "userSettings";
            return prev;
        });
    }, [setStep]);

    const onBack = useCallback(() => {
        setStep((prev: RegisterStep) => {
            if (prev === "userSettings") return "userOnboarding";
            if (prev === "userOnboarding") return "userInfo";
            return prev;
        });
    }, [setStep]);

    useEffect(() => reset, [reset]);

    return {
        step,
        onNext,
        onBack,
        reset,
    };
};
