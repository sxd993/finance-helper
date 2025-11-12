import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Convert } from "@/entities/convert";
import type { ConvertTab } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
import { useEditConvert } from "@/features/converts/edit-convert";

interface ReplenishFormValues {
  convertId: string;
  amount: number;
}

interface UseReplinishConvertFormParams {
  converts: Convert[];
  targetTypeCodes: ConvertTab[];
}

export const useReplinishConvertForm = ({
  converts,
  targetTypeCodes,
}: UseReplinishConvertFormParams) => {
  const eligibleConverts = useMemo(
    () => converts.filter((convert) => targetTypeCodes.includes(convert.type_code as ConvertTab)),
    [converts, targetTypeCodes],
  );

  const form = useForm<ReplenishFormValues>({
    defaultValues: {
      convertId: eligibleConverts[0]?.id ? String(eligibleConverts[0].id) : "",
      amount: 0,
    },
  });

  const { register, handleSubmit, watch, reset, formState } = form;

  useEffect(() => {
    reset({
      convertId: eligibleConverts[0]?.id ? String(eligibleConverts[0].id) : "",
      amount: 0,
    });
  }, [eligibleConverts, reset]);

  const selectedConvert = eligibleConverts.find(
    (convert) => String(convert.id) === watch("convertId"),
  );
  const amountValue = watch("amount");
  const isValidAmount = Number.isFinite(amountValue) && amountValue > 0;

  const { editConvert, isPending } = useEditConvert();

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedConvert) return;

    const nextInitial = Number(selectedConvert.initial_amount ?? 0) + Number(values.amount ?? 0);

    await editConvert({
      id: selectedConvert.id,
      name: selectedConvert.name,
      type_code: selectedConvert.type_code,
      target_amount: selectedConvert.target_amount ?? null,
      initial_amount: nextInitial,
      is_active: selectedConvert.is_active,
    });

    reset({
      convertId: String(selectedConvert.id),
      amount: 0,
    });
  });

  return {
    register,
    onSubmit,
    eligibleConverts,
    selectedConvert,
    isValidAmount,
    isPending,
    formState,
  };
};
