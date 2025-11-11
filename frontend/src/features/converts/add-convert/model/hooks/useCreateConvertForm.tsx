import { useState } from "react"
import { useForm } from "react-hook-form"
import { useCreateConvert } from "./useCreateConvert"
import type { CreateConvertPayload } from "../types"

export const useCreateConvertForm = () => {
  const form = useForm<CreateConvertPayload>()
  const { onCreateConverts, invalidateQueries, isPending } = useCreateConvert()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setErrorMessage(null)
      await onCreateConverts(data)
      await invalidateQueries()
      form.reset()
    } catch (error) {
      console.log(error)
    }
  })

  return {
    ...form,
    onSubmit,
    isPending,
    errorMessage,
  }
}
