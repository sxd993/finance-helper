import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInvestment } from '@/entities/convert/api'
import type { UpdateInvestmentPayload } from '@/features/converts/update-convert-investment/api/UpdateConvertInvestment'

import { toast } from 'sonner'

export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-investment'],
    mutationFn: updateInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] })
      toast.success('Инвестиция обновлена!')
    }
  })

  const onUpdateInvestment = async (data: UpdateInvestmentPayload) => {
    await mutation.mutateAsync(data)
  }

  return {
    onUpdateInvestment,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

