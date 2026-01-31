import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Expense } from "@/entities/expense"
import { AddExpense } from "../../api/AddExpense"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationKey: ["add-expense"],
        mutationFn: AddExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userExpenses"] });
            toast.success('Транзакция создана!')
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
