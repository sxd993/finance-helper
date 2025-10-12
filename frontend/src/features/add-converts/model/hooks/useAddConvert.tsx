import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addConvert } from "../../api/addConvert"
import type { CreateConvertPayload } from "../types/addConvertPayload.type"

export const useAddConvert = () => {
    const queryClient = useQueryClient();

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: addConvert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['converts'] })
        }
    })

    const onCreateConvert = async (data: CreateConvertPayload) => {
        await addConvertMutation.mutateAsync(data);
    }

    return {
        onCreateConvert,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error,
    }
}
