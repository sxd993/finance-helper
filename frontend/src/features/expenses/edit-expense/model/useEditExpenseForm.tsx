import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import type { Expense } from "@/entities/expense";
import type { AppDispatch } from "@/app/providers/StoreProvider/config/store";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";
import { useUserConvertsLimits } from "@/features/converts/get-user-converts-limits/model/useUserConvertsLimits";
import {
  DEFAULT_EXPENSE_ICON_NAME,
  resetIconPicker,
  selectIconPickerState,
} from "@/features/ui/pick-icons";
import { getConvertTitleOptions } from "@/features/expenses/add-expenses/lib/getConvertTitleOptions";
import { getConvertTypeOptions } from "@/features/expenses/add-expenses/lib/getConvertTypeOptions";

import { useEditExpense } from "./useEditExpense";
import type { EditExpenseFormValues } from "./types";

const formatDateInput = (timestamp?: number) => {
  if (!timestamp) return "";
  return new Date(timestamp).toISOString().slice(0, 10);
};

const parseDateInput = (value: string) => {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const useEditExpenseForm = (expense: Expense, onClose: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const { iconName } = useSelector(selectIconPickerState);
  const { converts } = useUserConverts();
  const { userConvertsLimits } = useUserConvertsLimits();
  const { editExpense, isPending } = useEditExpense();

  const form = useForm<EditExpenseFormValues>({
    defaultValues: {
      name: expense.name,
      convert_type: expense.convert_type,
      convert_id: expense.convert_id,
      sum: expense.sum,
      date: formatDateInput(expense.date),
      icon_name: expense.icon_name || DEFAULT_EXPENSE_ICON_NAME,
    },
  });

  const { register, watch, handleSubmit, setValue, getValues } = form;

  useEffect(() => {
    register("icon_name");
  }, [register]);

  useEffect(() => {
    dispatch(
      resetIconPicker({
        iconName: expense.icon_name || DEFAULT_EXPENSE_ICON_NAME,
      })
    );

    return () => {
      dispatch(resetIconPicker(undefined));
    };
  }, [dispatch, expense.icon_name]);

  useEffect(() => {
    const current = getValues("icon_name");
    if (current !== iconName) {
      setValue("icon_name", iconName, {
        shouldDirty: current !== iconName,
        shouldTouch: true,
      });
    }
  }, [getValues, iconName, setValue]);

  const convertType = watch("convert_type");
  const convertTypeOptions = useMemo(
    () => getConvertTypeOptions(userConvertsLimits),
    [userConvertsLimits]
  );
  const convertTitleOptions = useMemo(
    () => getConvertTitleOptions(converts, convertType),
    [converts, convertType]
  );

  useEffect(() => {
    const currentConvertId = getValues("convert_id");
    const hasCurrentOption = convertTitleOptions.some(
      (option) => Number(option.value) === currentConvertId
    );

    if (!hasCurrentOption && convertTitleOptions.length > 0) {
      setValue("convert_id", Number(convertTitleOptions[0].value), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [convertTitleOptions, getValues, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    await editExpense({
      ...expense,
      name: values.name.trim(),
      convert_type: values.convert_type,
      convert_id: Number(values.convert_id),
      sum: Number(values.sum),
      date: parseDateInput(values.date),
      icon_name: values.icon_name,
    });

    onClose();
  });

  return {
    register,
    onSubmit,
    convertTypeOptions,
    convertTitleOptions,
    isPending,
  };
};
