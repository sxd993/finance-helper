import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch } from "@/app/providers/StoreProvider/config/store"
import {
    selectIconPickerState,
    setIconColor,
    setIconName,
} from "./iconPicker.slice"
import { useMemo } from 'react'
import { EXPENSE_ICON_OPTIONS } from "../const/registry"

export const useIconPicker = () => {

    // Состояния из редукса
    const { iconName, iconColor } = useSelector(selectIconPickerState)
    const dispatch = useDispatch<AppDispatch>()

    // Выбранная иконка
    const selectedIcon = useMemo(
        () => EXPENSE_ICON_OPTIONS.find((option) => option.value === iconName),
        [iconName],
    )

    // Действия
    const handleIconSelect = (value: string) => {
        dispatch(setIconName(value))
    }

    const handleColorChange = (event) => {
        dispatch(setIconColor(event.target.value))
    }


    return {
        // Состояния
        iconName,
        iconColor,
        selectedIcon,

        // Действия
        handleIconSelect,
        handleColorChange,
    }

}