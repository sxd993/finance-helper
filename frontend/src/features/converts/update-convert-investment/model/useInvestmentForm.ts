import { useForm } from 'react-hook-form'
import { useUpdateInvestment } from './useUpdateInvestment'

type FormValues = {
  invested_amount: number | null
  current_value: number | null
}

export const useInvestmentForm = (opts: {
  convertId: number;
  invested_amount?: number | null;
  current_value?: number | null
}) => {
  const { onUpdateInvestment, isPending, error } = useUpdateInvestment()
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      invested_amount: opts.invested_amount ?? null,
      current_value: opts.current_value ?? null,
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    await onUpdateInvestment({ id: opts.convertId, invested_amount: (data.invested_amount ?? 0), current_value: (data.current_value ?? 0) })
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
