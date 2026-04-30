import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAddExpenseMutation } from "./useAddExpenseMutation";
import type { Expense } from "@/entities/expense";
import { DEFAULT_EXPENSE_ICON_NAME } from "../../../../ui/pick-icons";
import { selectIconPickerState, resetIconPicker } from "../../../../ui/pick-icons";
import { getConvertTitleOptions } from "../../lib/getConvertTitleOptions";
import { getConvertTypeOptions } from "../../lib/getConvertTypeOptions";
import type { AppDispatch } from "@/app/providers/StoreProvider/config/store";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits";

interface UseAddExpenseFormOptions {
  onSuccess?: () => void;
}

export const useAddExpenseForm = ({ onSuccess }: UseAddExpenseFormOptions = {}) => {
  const { onAddExpense } = useAddExpenseMutation({ onSuccess });
  const { converts } = useUserConverts();;

  const dispatch = useDispatch<AppDispatch>();
  const { iconName } = useSelector(selectIconPickerState);

  const form = useForm<Expense>({
    defaultValues: {
      name: "",
      convert_id: 0,
      convert_type: "",
      sum: 0,
      icon_name: DEFAULT_EXPENSE_ICON_NAME,
    },
  });

  const { register, watch, handleSubmit, setValue, getValues } = form;

  // регистрация полей и инициализация
  useEffect(() => {
    register("icon_name");
  }, [register]);

  useEffect(() => {
    dispatch(
      resetIconPicker({
        iconName: DEFAULT_EXPENSE_ICON_NAME,
      })
    );

    return () => {
      dispatch(resetIconPicker(undefined));
    };
  }, [dispatch]);

  useEffect(() => {
    const current = getValues("icon_name");
    if (current !== iconName) {
      setValue("icon_name", iconName, {
        shouldDirty: current !== iconName,
        shouldTouch: true,
      });
    }
  }, [iconName, getValues, setValue]);

  const convertType = watch("convert_type");

  const { userConvertsLimits } = useUserConvertsLimits();
  const convertTypeOptions = getConvertTypeOptions(userConvertsLimits);
  const convertTitleOptions = getConvertTitleOptions(converts, convertType);

  useEffect(() => {
    const currentConvertId = getValues("convert_id");
    const hasCurrentOption = convertTitleOptions.some(
      (option) => Number(option.value) === currentConvertId
    );

    if (hasCurrentOption) {
      return;
    }

    if (convertTitleOptions.length > 0) {
      setValue("convert_id", Number(convertTitleOptions[0].value), {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    setValue("convert_id", 0, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [convertTitleOptions, getValues, setValue]);

  const onSubmit = handleSubmit(onAddExpense);

  return {
    register,
    onSubmit,
    convertTitleOptions,
    convertTypeOptions,
  };
};
