import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAddExpenseMutation } from "./useAddExpenseMutation";
import type { Expense } from "@/entities/expense";
import {
  DEFAULT_EXPENSE_ICON_COLOR,
  DEFAULT_EXPENSE_ICON_NAME,
} from "../../../../pick-icons";
import { selectIconPickerState, resetIconPicker } from "../../../../pick-icons";
import { getConvertTypeOptions } from "../../lib/getConvertTypeOptions";
import { getConvertTitleOptions } from "../../lib/getConvertTitleOptions";
import type { AppDispatch } from "@/app/providers/StoreProvider/config/store";
import { useUserConverts } from "@/features/converts/get-user-converts/models/useUserConverts";

export const useAddExpenseForm = () => {
  const { onAddExpense } = useAddExpenseMutation();
  const { converts } = useUserConverts();;

  const dispatch = useDispatch<AppDispatch>();
  const { iconColor, iconName } = useSelector(selectIconPickerState);

  const form = useForm<Expense>({
    defaultValues: {
      name: "",
      convert_type: "",
      convert_name: "",
      sum: 0,
      icon_name: DEFAULT_EXPENSE_ICON_NAME,
      icon_color: DEFAULT_EXPENSE_ICON_COLOR,
    },
  });

  const { register, watch, handleSubmit, setValue, getValues } = form;

  // регистрация полей и инициализация
  useEffect(() => {
    register("icon_name");
    register("icon_color");
  }, [register]);

  useEffect(() => {
    dispatch(
      resetIconPicker({
        iconName: DEFAULT_EXPENSE_ICON_NAME,
        iconColor: DEFAULT_EXPENSE_ICON_COLOR,
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

  useEffect(() => {
    const current = getValues("icon_color");
    if (current !== iconColor) {
      setValue("icon_color", iconColor, {
        shouldDirty: current !== iconColor,
        shouldTouch: true,
      });
    }
  }, [iconColor, getValues, setValue]);

  const convertType = watch("convert_type");

  const convertTitleOptions = getConvertTitleOptions(converts, convertType);

  const onSubmit = handleSubmit(onAddExpense);

  return {
    register,
    onSubmit,
    convertTitleOptions,
  };
};
