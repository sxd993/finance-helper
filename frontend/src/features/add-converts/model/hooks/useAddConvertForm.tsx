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
      target_amount: null,
      current_amount: null,
    },
  })
  const { onCreateConvert, isSuccess, isPending, error } = useAddConvert()
  const type = watch('type_code')

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

  }
}
