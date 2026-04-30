import { isAxiosError } from "axios";
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
            const message = isAxiosError(error)
                ? error.response?.data?.message ?? "Не удалось создать конверт"
                : "Не удалось создать конверт";
            toast.error(message)
        }
    })

    const onCreateConverts = async (data: CreateConvertPayload) => {
        return CreateConvertMutation.mutateAsync(data);
    }

    const invalidateQueries = async () => {
        await Promise.all([
            queryClient.refetchQueries({ queryKey: ['converts'] }),
            queryClient.refetchQueries({ queryKey: ['limits'] }),
            queryClient.refetchQueries({ queryKey: ['converts', 'limits'] }),
        ]);
    };

    return {
        onCreateConverts,
        invalidateQueries,
        reset: CreateConvertMutation.reset,
        isSuccess: CreateConvertMutation.isSuccess,
        isPending: CreateConvertMutation.isPending,
        error: CreateConvertMutation.error,
    }
}
