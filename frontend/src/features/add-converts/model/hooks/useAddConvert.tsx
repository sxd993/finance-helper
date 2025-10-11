import { createConvert, type CreateConvertPayload } from "@/entities/convert"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from 'axios'

export const useAddConvert = () => {

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: createConvert
    })

    const onCreateConvert = async (data: CreateConvertPayload) => {
        await addConvertMutation.mutateAsync(data);
    }
    const rawError = addConvertMutation.error as AxiosError | null | undefined;
    const errorMessage = rawError
        ? (rawError.response?.data?.message as string) || rawError.message
        : undefined

    return {
        onCreateConvert,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error,
        errorMessage,
    }
}
