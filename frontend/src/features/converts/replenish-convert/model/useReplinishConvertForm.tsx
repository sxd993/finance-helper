import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/providers";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits";

import { useReplinishConvertMutation } from "./useReplinishConvertMutation";
import type { ReplenishFormValues, ReplenishSourceType } from "./types";
import { useSourceTypeController } from "../lib/useSourceTypeController";
import { useConvertSelection } from "../lib/useConvertSelection";

export const useReplinishConvertForm = () => {
  const storedSourceType = useSelector(
    (state: RootState) => state.replenish_form.sourceType,
  );
  const { converts, isLoading: convertsLoading } = useUserConverts();
  const { userConvertsLimits, isLoading: limitsLoading } = useUserConvertsLimits();

  const form = useForm<ReplenishFormValues>({
    defaultValues: {
      sourceType: storedSourceType ?? "",
      convertId: "",
      amount: 0,
    },
  });
  const { register, handleSubmit, reset, formState } = form;

  const sourceControl = useSourceTypeController({
    form,
    storedSourceType: storedSourceType as ReplenishSourceType | null,
    limits: userConvertsLimits,
  });

  const convertControl = useConvertSelection({
    form,
    converts,
    sourceTypeValue: sourceControl.sourceTypeValue,
  });

  const isLoading = convertsLoading || limitsLoading;
  const { replenishConvert, isPending } = useReplinishConvertMutation();

  const onSubmit = handleSubmit(async (values) => {
    if (!convertControl.selectedConvert || !values.sourceType) return;

    await replenishConvert({
      type_code: values.sourceType,
      convert_id: convertControl.selectedConvert.id,
      amount: values.amount ?? 0,
    });

    reset({
      sourceType: values.sourceType,
      convertId: String(convertControl.selectedConvert.id),
      amount: 0,
    });
  });

  return {
    register,
    onSubmit,
    handleSourceTypeChange: sourceControl.handleSourceTypeChange,
    eligibleConverts: convertControl.eligibleConverts,
    availableRemainder: sourceControl.availableRemainder,
    isPending,
    isLoading,
    sourceTypeOptions: sourceControl.sourceTypeOptions,
    formState,
  };
};
