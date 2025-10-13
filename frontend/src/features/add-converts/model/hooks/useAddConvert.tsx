import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addConvert } from "../../api/addConvert"
import type { CreateConvertPayload } from "../types/addConvertPayload.type"
import { toast } from "sonner";

export const useAddConvert = () => {
    const queryClient = useQueryClient();

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: addConvert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['converts'] })
            toast.success('Конверты успешно созданы')
            // Добавить чистку черновика
        }
    })

    const onCreateConverts = async (data: CreateConvertPayload) => {
        await addConvertMutation.mutateAsync(data);
    }

    return {
        onCreateConverts,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error,
    }
}
