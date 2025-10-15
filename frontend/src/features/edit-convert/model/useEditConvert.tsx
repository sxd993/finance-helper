import type { EditConvertPayload } from "./type"
import { editConvert } from "@/entities/convert/api/editConvert"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'sonner'

export const useEditConvert = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['update-investment'],
        mutationFn: editConvert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['converts'] })
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

