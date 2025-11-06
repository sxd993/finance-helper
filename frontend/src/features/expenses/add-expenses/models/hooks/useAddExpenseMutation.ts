import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addExpense, type Expense } from "@/entities/expense"
import { toast } from "sonner"

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["add-expense"],
        mutationFn: addExpense,
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success('Транзакция создана!')
        },
        onError: () => {
            toast.error('Ошибка при создании транзакции')
        }
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