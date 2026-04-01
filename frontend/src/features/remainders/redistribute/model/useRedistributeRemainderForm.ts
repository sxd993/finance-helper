import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { useUserConverts } from "@/features/converts/get-user-converts";
import { useUserRemainders } from "@/features/remainders/get-user-remainders/model/useUserRemainders";
import { useRedistributeRemainderMutation } from "./useRedistributeRemainderMutation";

interface FormValues {
  convertId: number;
  amount: number;
}

const ALLOWED_TYPE_CODES = new Set(["saving", "investment"]);

export const useRedistributeRemainderForm = (onClose: () => void) => {
  const { converts, isLoading: isConvertsLoading } = useUserConverts();
  const { summary } = useUserRemainders();
  const { redistribute, isPending } = useRedistributeRemainderMutation();

  const targetConverts = useMemo(
    () => (converts ?? []).filter((convert) => ALLOWED_TYPE_CODES.has(convert.type_code)),
    [converts]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      convertId: targetConverts[0]?.id ?? 0,
      amount: summary.total_amount > 0 ? summary.total_amount : 0,
    },
  });

  useEffect(() => {
    if (targetConverts[0] && !watch("convertId")) {
      setValue("convertId", targetConverts[0].id);
    }
  }, [setValue, targetConverts, watch]);

  useEffect(() => {
    const currentAmount = watch("amount");
    if (!currentAmount && summary.total_amount > 0) {
      setValue("amount", summary.total_amount);
    }
  }, [setValue, summary.total_amount, watch]);

  const onSubmit = handleSubmit(async (values) => {
    await redistribute({
      convert_id: Number(values.convertId),
      amount: Number(values.amount),
    });
    onClose();
  });

  return {
    register,
    onSubmit,
    formState,
    targetConverts,
    totalAmount: summary.total_amount,
    isLoading: isConvertsLoading,
    isPending,
  };
};
