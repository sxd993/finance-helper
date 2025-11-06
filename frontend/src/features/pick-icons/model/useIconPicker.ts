import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/app/providers/StoreProvider/config/store"
import {
  selectIconPickerState,
  setIconColor,
  setIconName,
} from "./iconPicker.slice"
import { useMemo } from "react"
import {
  EXPENSE_ICON_OPTIONS,
  EXPENSE_ICON_REGISTRY,
} from "../const/registry"

export const useIconPicker = () => {
  const { iconName, iconColor } = useSelector(selectIconPickerState)
  const dispatch = useDispatch<AppDispatch>()

  const selectedIcon = useMemo(() => {
    const found = EXPENSE_ICON_OPTIONS.find(({ value }) => {
      const icon = EXPENSE_ICON_REGISTRY[value]
      return icon?.displayName === iconName || icon?.name === iconName
    })
    return found
  }, [iconName])


  const handleIconSelect = (value: string) => {
    const icon = EXPENSE_ICON_REGISTRY[value as keyof typeof EXPENSE_ICON_REGISTRY]
    if (icon) {
      const lucideName = icon.displayName || icon.name || value
      dispatch(setIconName(lucideName))
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIconColor(e.target.value))
  }

  return { iconName, iconColor, selectedIcon, handleIconSelect, handleColorChange }
}
