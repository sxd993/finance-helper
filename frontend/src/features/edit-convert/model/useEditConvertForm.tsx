import { useForm } from "react-hook-form"
import { useEditConvert } from "./useEditConvert";
import type { EditConvertPayload } from "./type";

export const useEditConvertForm = (opt: EditConvertPayload) => {
    const { mutateEditConvert, isPending, error } = useEditConvert();
    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            id: opt.id,
            name: opt.name,
            overall_limit: opt.overall_limit
        }
    });

    const onSubmit = handleSubmit(async (data: EditConvertPayload) => {
        await mutateEditConvert(data)
        reset(data)
    })
    return {
        register,
        onSubmit,
        error,
        isPending,
        reset,
        formState
    }
}