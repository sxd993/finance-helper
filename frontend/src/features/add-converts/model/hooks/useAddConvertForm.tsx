import { useForm } from "react-hook-form"
import type { CreateConvertPayload } from "@/entities/convert"
import { useConvertTypes } from "@/entities/convert"
import { useAddConvert } from "./useAddConvert"
import { toast } from "sonner"

export const useAddConvertForm = () => {
  const { convert_types } = useConvertTypes()
  const { register, handleSubmit, watch, reset } = useForm<CreateConvertPayload>({
    defaultValues: {
      name: '',
      type_code: '',
      current_amount: null,
      target_amount: null,
    },
  })
  const { onCreateConvert, isSuccess, isPending, error, errorMessage } = useAddConvert()
  const type = watch('type_code')

  // Контроль доступности сабмита: оба поля обязательны, а для saving — ещё и цель
  const name = watch('name')?.trim()
  const target = watch('target_amount')
  const current = watch('current_amount')
  const canSubmitBase = Boolean(name) && Boolean(type)
  const canSubmit = type === 'saving' ? (canSubmitBase && (target !== null && target !== undefined)) : canSubmitBase

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onCreateConvert(data)
      toast.success('Конверт успешно создан!')
      reset()
    } catch {
      toast.error('Ошибка при создании конверта')
    }
  })

  return {
    register,
    onSubmit,
    type,
    convert_types,
    isPending,
    isSuccess,
    error,
    errorMessage,
    canSubmit,

  }
}
