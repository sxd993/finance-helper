import { useForm } from "react-hook-form"
import { useAddExpenseMutation } from "./useAddExpenseMutation"
import type { Expense } from "@/entities/expense"
import {
    DEFAULT_EXPENSE_ICON_COLOR,
    DEFAULT_EXPENSE_ICON_NAME,
} from "../../lib/icons"

export const useAddExpenseForm = () => {
    
    const { onAddExpense } = useAddExpenseMutation();
    const form = useForm<Expense>({
        defaultValues: {
            name: "",
            convert_type: "",
            convert_title: "",
            sum: 0,
            icon_name: DEFAULT_EXPENSE_ICON_NAME,
            icon_color: DEFAULT_EXPENSE_ICON_COLOR,
        }
    })

    const onSubmit = form.handleSubmit(data => {
        onAddExpense(data)
    })

    return { ...form, onSubmit }
}
