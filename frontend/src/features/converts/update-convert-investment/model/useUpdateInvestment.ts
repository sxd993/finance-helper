import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateConvertInvestment, type UpdateConvertInvestmentPayload } from '@/features/converts/update-convert-investment/api/UpdateConvertInvestment'

import { toast } from 'sonner'

export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-investment'],
    mutationFn: UpdateConvertInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] })
      toast.success('Инвестиция обновлена!')
    }
  })

  const onUpdateInvestment = async (data: UpdateConvertInvestmentPayload) => {
    await mutation.mutateAsync(data)
  }

  return {
    onUpdateInvestment,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

