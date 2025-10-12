import { useForm } from "react-hook-form"
import type { CreateConvertPayload } from "../types/addConvertPayload.type"
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
      overall_limit: null,
      initial_investment: null,
      current_value: null,
    },
  })
  const { onCreateConvert, isSuccess, isPending, error } = useAddConvert()
  const type = watch('type_code')

  // Контроль доступности сабмита: оба поля обязательны, а для saving — ещё и цель
  const name = watch('name')?.trim()
  const target = watch('target_amount')
  const initialInv = watch('initial_investment')
  const overall = watch('overall_limit')
  const currentVal = watch('current_value')

  const canSubmitBase = Boolean(name) && Boolean(type)
  let canSubmit = canSubmitBase
  if (type === 'saving') {
    canSubmit = canSubmitBase && (target !== null && target !== undefined)
  } else if (type === 'important' || type === 'wishes') {
    // не обязательно, но если число задано — ок
    canSubmit = canSubmitBase && (overall === null || typeof overall === 'number')
  } else if (type === 'investment') {
    // хотя бы одно из значений можно передать
    canSubmit = canSubmitBase && (
      initialInv !== undefined || currentVal !== undefined
    )
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Build payload per type to avoid sending irrelevant fields
      let payload: CreateConvertPayload = {
        name: data.name,
        type_code: data.type_code,
        is_active: true,
      };

      switch (data.type_code) {
        case 'saving':
          payload = {
            ...payload,
            target_amount: data.target_amount ?? null,
            current_amount: data.current_amount ?? 0,
          };
          break;
        case 'important':
        case 'wishes':
          payload = {
            ...payload,
            overall_limit: data.overall_limit ?? 0,
            current_amount: data.current_amount ?? 0,
          };
          break;
        case 'investment':
          payload = {
            ...payload,
            initial_investment: data.initial_investment ?? null,
            current_value: data.current_value ?? null,
          };
          break;
      }

      await onCreateConvert(payload)
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
    canSubmit,

  }
}
