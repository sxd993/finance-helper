import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Expense } from "@/entities/expense"
import { AddExpense } from "../../api/AddExpense"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface UseAddExpenseMutationOptions {
    onSuccess?: () => void;
}

export const useAddExpenseMutation = ({ onSuccess }: UseAddExpenseMutationOptions = {}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationKey: ["add-expense"],
        mutationFn: AddExpense,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["userExpenses"] }),
                queryClient.invalidateQueries({ queryKey: ["history"] }),
                queryClient.invalidateQueries({ queryKey: ["converts"] }),
                queryClient.invalidateQueries({ queryKey: ["limits"] }),
                queryClient.invalidateQueries({ queryKey: ["converts", "limits"] }),
            ]);
            toast.success('Транзакция создана!')
            if (onSuccess) {
                onSuccess();
                return;
            }
            navigate(-1);
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
