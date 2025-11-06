import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateConvert } from "../../api/CreateConvert"
import type { CreateConvertPayload } from "../types"

export const useCreateConvert = () => {
    const queryClient = useQueryClient();

    const CreateConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: CreateConvert,
    })

    const onCreateConverts = async (data: CreateConvertPayload) => {
        return CreateConvertMutation.mutateAsync(data);
    }

    const invalidateQueries = () => queryClient.invalidateQueries();

    return {
        onCreateConverts,
        invalidateQueries,
        reset: CreateConvertMutation.reset,
        isSuccess: CreateConvertMutation.isSuccess,
        isPending: CreateConvertMutation.isPending,
        error: CreateConvertMutation.error,
    }
}
