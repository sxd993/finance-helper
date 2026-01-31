import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateConvert } from "../../api/CreateConvert"
import type { CreateConvertPayload } from "../types"
import { toast } from "sonner";

export const useCreateConvert = () => {
    const queryClient = useQueryClient();

    const CreateConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: CreateConvert,
        onSuccess: () => {
            toast.success('Конверт успешно создан')
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
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
