import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addConvert } from "../../api/addConvert"
import type { CreateConvertPayload } from "../types/addConvertPayload.type"
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearDrafts } from "@features/add-converts/model/store/createConvertDraftsSlice";

export const useAddConvert = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch()

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: addConvert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['converts'] })
            toast.success('Конверты успешно созданы')
            dispatch(clearDrafts())
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
