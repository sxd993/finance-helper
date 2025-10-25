import { useMutation } from "@tanstack/react-query"
import { addExpense, type Expense } from "@/entities/expense"

export const useAddExpenseMutation = () => {
    const mutation = useMutation({
        mutationKey: ["add-expense"],
        mutationFn: addExpense
    })

    const onAddExpense = async (expense: Expense) => {
        await mutation.mutateAsync(expense);
    }

    return {
        onAddExpense,
        isSuccess: mutation.isSuccess,
        isPending: mutation.isPending,
        error: mutation.error
    }
}