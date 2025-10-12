import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInvestment } from '@/entities/convert/api'

type Payload = {
  id: number
  initial_investment: number
  current_value: number
}

export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['update-investment'],
    mutationFn: updateInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] })
    }
  })

  const onUpdateInvestment = async (data: Payload) => {
    await mutation.mutateAsync(data)
  }

  return {
    onUpdateInvestment,
    isSuccess: mutation.isSuccess,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

