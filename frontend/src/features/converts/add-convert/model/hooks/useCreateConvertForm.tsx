import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { useCreateConvert } from "./useCreateConvert"
import type { CreateConvertPayload } from "../types"

export const useCreateConvertForm = () => {
  const [searchParams] = useSearchParams()
  const presetType = useMemo(() => {
    const type = searchParams.get("type") || ""
    const allowed = new Set(["important", "wishes", "saving", "investment"])
    return allowed.has(type) ? type : ""
  }, [searchParams])

  const form = useForm<CreateConvertPayload>({
    defaultValues: {
      type_code: presetType,
    },
  })
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
