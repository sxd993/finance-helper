import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/shared/hooks/useUser";
import { useUpdateProfileMutation } from "./useUpdateProfileMutation";
import type { ProfileFormValues } from "./types";

export const useChangeProfileInfo = () => {
  const { user, isLoading } = useUser();
  const { mutateAsync, isPending } = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formValues = useMemo<ProfileFormValues>(
    () => ({
      name: user.name ?? "",
      login: user.login ?? "",
      email: user.email ?? "",
      monthlyIncome: Number(user.monthlyIncome ?? 0),
    }),
    [user],
  );

  const form = useForm<ProfileFormValues>({
    mode: "onChange",
    defaultValues: formValues,
  });

  const { register, handleSubmit, reset, formState } = form;

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const previousIncome = Number(user.monthlyIncome ?? 0);
    const response = await mutateAsync({
      name: values.name.trim(),
      login: values.login.trim(),
      email: values.email.trim(),
      monthlyIncome: Number(values.monthlyIncome || 0),
    });

    const updatedIncome = Number(response.user.monthlyIncome ?? 0);
    if (previousIncome !== updatedIncome) {
      setSuccessMessage(
        "Вы изменили месячный доход.\nВ следующем цикле лимиты конвертов будут изменены.",
      );
    } else {
      setSuccessMessage(null);
    }
  });

  const handleReset = useCallback(() => {
    reset(formValues);
    setSuccessMessage(null);
  }, [reset, formValues]);

  return {
    register,
    onSubmit,
    handleReset,
    errors: formState.errors,
    isDirty: formState.isDirty,
    isPending,
    isLoadingUser: isLoading,
    successMessage,
  };
};
