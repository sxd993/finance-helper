import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '@/entities/expense'
import type { createExpenseData } from '@/entities/expense';

export const useCreateExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: createExpenseData) => createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    })
}

