import { useForm } from "react-hook-form"
import { useAddExpenseMutation } from "./useAddExpenseMutation"
import { useConvertOverview, useConverts } from "@/entities/convert"
import type { Expense } from "@/entities/expense"
import {
  DEFAULT_EXPENSE_ICON_COLOR,
  DEFAULT_EXPENSE_ICON_NAME,
  useIcons,
} from "../../lib/icons"
import { formatPrice } from "@/shared/utils/formatPrice"

export const useAddExpenseForm = () => {
  const { onAddExpense } = useAddExpenseMutation()
  const { convertOverview } = useConvertOverview()
  const { converts } = useConverts()

  const form = useForm<Expense>({
    defaultValues: {
      name: "",
      convert_type: "",
      convert_name: "",
      sum: 0,
      icon_name: DEFAULT_EXPENSE_ICON_NAME,
      icon_color: DEFAULT_EXPENSE_ICON_COLOR,
    },
  })

  const { register, watch, handleSubmit } = form

  const convertType = watch("convert_type")
  const { iconName, iconColor, iconOptions, isIconMenuOpen, toggleIconMenu, closeIconMenu, handleIconSelect } =
    useIcons(form)

  // опции для селектов
  const convertTypeOptions =
    convertOverview?.map((convert) => ({
      value: convert.info?.code ?? "",
      label: convert.info?.title ?? convert.info?.code ?? "",
    })) ?? []

  const convertTitleOptions =
    converts
      ?.filter((c) => c.type_code === convertType)
      .map((convert) => ({
        value: convert.name,
        label: `${convert.name} (${formatPrice(convert.current_balance)})`,
      })) ?? []

  const onSubmit = handleSubmit((data) => {
    onAddExpense(data)
  })

  return {
    register,
    onSubmit,
    iconName,
    iconColor,
    iconOptions,
    convertTypeOptions,
    convertTitleOptions,
    isIconMenuOpen,
    toggleIconMenu,
    closeIconMenu,
    handleIconSelect,
  }
}
