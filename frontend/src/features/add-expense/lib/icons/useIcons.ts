import { useCallback, useEffect, useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"

import type { Expense } from "@/entities/expense"

import { EXPENSE_ICON_OPTIONS } from "./registry"

export const useIcons = (form: Pick<UseFormReturn<Expense>, "watch" | "setValue" | "register">) => {
  const { watch, setValue, register } = form

  useEffect(() => {
    register("icon_name")
  }, [register])

  const iconName = watch("icon_name")
  const iconColor = watch("icon_color")

  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false)

  const toggleIconMenu = useCallback(() => {
    setIsIconMenuOpen((prev) => !prev)
  }, [])

  const closeIconMenu = useCallback(() => {
    setIsIconMenuOpen(false)
  }, [])

  const handleIconSelect = useCallback(
    (value: string) => {
      setValue("icon_name", value, { shouldDirty: true, shouldTouch: true })
      closeIconMenu()
    },
    [setValue, closeIconMenu],
  )

  const iconOptions = useMemo(() => EXPENSE_ICON_OPTIONS, [])

  return {
    iconName,
    iconColor,
    iconOptions,
    isIconMenuOpen,
    toggleIconMenu,
    closeIconMenu,
    handleIconSelect,
  }
}
