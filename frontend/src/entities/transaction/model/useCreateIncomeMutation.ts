import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createIncome } from '@entities/transaction/api/transactionsApi'
import type { createIncomeData } from '@/entities/transaction/model/types'

export const useCreateIncomeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: createIncomeData) => createIncome(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    })
}