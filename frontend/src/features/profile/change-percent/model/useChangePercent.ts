import { useState } from "react";
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

  // Синхронизируем форму с актуальными данными пользователя
  const defaultValues: ChangePercentFormValues = {
    percentImportant: normalizePercent(user?.percentImportant),
    percentWishes: normalizePercent(user?.percentWishes),
    percentSaving: normalizePercent(user?.percentSaving),
    percentInvestment: normalizePercent(user?.percentInvestment),
  };

  // Инициализируем react-hook-form в режиме "onChange"
  const form = useForm<ChangePercentFormValues>({
    mode: "onChange",
    defaultValues,
  });

  // Следим за текущими значениями для прогрессбаров/валидации
  const values = form.watch();
  const totalPercentage = sumDistribution(values);

  // Сбрасываем форму к исходным данным
  const handleReset = () => {
    form.reset(defaultValues);
    setSuccessMessage(null);
  };

  // Сабмит с проверкой тотала перед вызовом API
  const handleSubmit = form.handleSubmit(async (values) => {
    const total = sumDistribution(values);

    if (!isValidTotal(total)) {
      form.setError("root", {
        type: "validate",
        message: "Сумма процентов должна равняться 100%",
      });
      return;
    }

    form.clearErrors("root");

    const response = await mutateAsync(values)
    setSuccessMessage(response.message);
  });

  return {
    form: {
      register: form.register,
      handleSubmit,
      errors: form.formState.errors,
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
    },
    uiState: {
      currentPercents: values,
      totalPercentage,
      totalError: form.formState.errors.root?.message ?? null,
      successMessage,
      isPending,
      isLoadingUser,
    },
    actions: {
      handleReset,
    },
  };
};
