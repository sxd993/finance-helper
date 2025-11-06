import type { EditConvertPayload } from "./type"
import { EditConvert } from "../api/editConvert"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'sonner'

export const useEditConvert = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['update-investment'],
        mutationFn: EditConvert,
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success('Конверт успешно изменен')
        }
    })

    const mutateEditConvert = async (data: EditConvertPayload) => {
        await mutation.mutateAsync(data)
    }

    return {
        mutateEditConvert,
        isSuccess: mutation.isSuccess,
        isPending: mutation.isPending,
        error: mutation.error,
    }
}

