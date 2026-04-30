import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/shared/hooks/useUser";
import {
  normalizePercent,
  sumDistribution,
  isValidTotal,
} from "../lib/helpers";
import type { ChangePercentFormValues } from "./types";
import { useUpdateDistributionMutation } from "./useUpdateDistributionMutation";

export const useChangePercent = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const { mutateAsync, isPending } = useUpdateDistributionMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const defaultValues = useMemo<ChangePercentFormValues>(
    () => ({
      percentImportant: normalizePercent(user?.percentImportant),
      percentWishes: normalizePercent(user?.percentWishes),
      percentSaving: normalizePercent(user?.percentSaving),
      percentInvestment: normalizePercent(user?.percentInvestment),
    }),
    [
      user?.percentImportant,
      user?.percentWishes,
      user?.percentSaving,
      user?.percentInvestment,
    ],
  );

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState,
  } = useForm<ChangePercentFormValues>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      reset(defaultValues);
      setSuccessMessage(null);
    }
  }, [defaultValues, reset, user]);

  const values = watch();
  const totalPercentage = sumDistribution(values);
  const monthlyIncome = Number(user?.monthlyIncome || 0);

  const handleReset = () => {
    reset(defaultValues);
    setSuccessMessage(null);
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    const total = sumDistribution(values);

    if (!isValidTotal(total)) {
      setError("root", {
        type: "validate",
        message: "Сумма процентов должна равняться 100%",
      });
      return;
    }

    clearErrors("root");

    const response = await mutateAsync(values);
    setSuccessMessage(response.message);
  });

  return {
    form: {
      register,
      handleSubmit,
      errors: formState.errors,
      isDirty: formState.isDirty,
      isValid: formState.isValid,
    },
    uiState: {
      currentPercents: values,
      monthlyIncome,
      totalPercentage,
      totalError: formState.errors.root?.message ?? null,
      successMessage,
      isPending,
      isLoadingUser,
    },
    actions: {
      handleReset,
    },
  };
};
