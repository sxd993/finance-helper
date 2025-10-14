import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createIncome } from '@entities/transaction'
import type { createIncomeData } from '@entities/transaction'

export const useCreateIncomeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: createIncomeData) => createIncome(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    })
}
