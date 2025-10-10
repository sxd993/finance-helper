import { createConvert, type CreateConvertPayload } from "@/entities/convert"
import { useMutation } from "@tanstack/react-query"

export const useAddConvert = () => {

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: createConvert
    })

    const onCreateConvert = async (data: CreateConvertPayload) => {
        await addConvertMutation.mutateAsync(data);
    }
    return {
        onCreateConvert,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error
    }
}