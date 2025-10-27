import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addConvert } from "../../api/addConvert"
import type { CreateConvertPayload } from "../types/addConvertPayload.type"

export const useAddConvert = () => {
    const queryClient = useQueryClient();

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: addConvert,
    })

    const onCreateConverts = async (data: CreateConvertPayload) => {
        return addConvertMutation.mutateAsync(data);
    }

    const invalidateQueries = () => queryClient.invalidateQueries();

    return {
        onCreateConverts,
        invalidateQueries,
        reset: addConvertMutation.reset,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error,
    }
}
