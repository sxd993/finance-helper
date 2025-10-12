import { useMutation } from "@tanstack/react-query"
import { addConvert } from "../../api/addConvert"
import type { addConvertPayload } from "../types/addConvertPayload.type"

export const useAddConvert = () => {

    const addConvertMutation = useMutation({
        mutationKey: ['add-convert'],
        mutationFn: addConvert
    })

    const onCreateConvert = async (data: addConvertPayload) => {
        await addConvertMutation.mutateAsync(data);
    }

    return {
        onCreateConvert,
        isSuccess: addConvertMutation.isSuccess,
        isPending: addConvertMutation.isPending,
        error: addConvertMutation.error,
    }
}
