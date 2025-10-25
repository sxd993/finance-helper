import { useForm } from "react-hook-form"
import { useAddExpenseMutation } from "./useAddExpenseMutation"
import type { Expense } from "@/entities/expense"

export const useAddExpenseForm = () => {
    
    const { onAddExpense } = useAddExpenseMutation();
    const form = useForm<Expense>({
        defaultValues: {
            name: "",
            convert_type: "",
            convert_title: "",
            sum: 0,
            icon_name: "",
            icon_color: "",
        }
    })

    const onSubmit = form.handleSubmit(data => {
        onAddExpense(data)
    })

    return { ...form, onSubmit }
}