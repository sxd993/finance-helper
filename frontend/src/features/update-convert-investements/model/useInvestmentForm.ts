import { useForm } from 'react-hook-form'
import { useUpdateInvestment } from './useUpdateInvestment'

type FormValues = {
  initial_amount: number | null
  current_value: number | null
}

export const useInvestmentForm = (opts: {
  convertId: number;
  initial_amount?: number | null;
  current_value?: number | null
}) => {
  const { onUpdateInvestment, isPending, error } = useUpdateInvestment()
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      initial_amount: opts.initial_amount ?? null,
      current_value: opts.current_value ?? null,
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    await onUpdateInvestment({ id: opts.convertId, initial_amount: (data.initial_amount ?? 0), current_value: (data.current_value ?? 0) })
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
