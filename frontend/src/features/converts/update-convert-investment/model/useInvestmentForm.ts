import { useForm } from 'react-hook-form'
import { useUpdateInvestment } from './useUpdateInvestment'

type FormValues = {
  initial_amount: number | null
  target_amount: number | null
}

export const useInvestmentForm = (opts: {
  convertId: number;
  initial_amount?: number | null;
  target_amount?: number | null
}) => {
  const { onUpdateInvestment, isPending, error } = useUpdateInvestment()
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      initial_amount: opts.initial_amount ?? null,
      target_amount: opts.target_amount ?? null,
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    await onUpdateInvestment({ id: opts.convertId, initial_amount: (data.initial_amount ?? 0), target_amount: (data.target_amount ?? 0) })
    reset(data)
  })

  return {
    register,
    onSubmit,
    isPending,
    error,
    formState
  }
}
