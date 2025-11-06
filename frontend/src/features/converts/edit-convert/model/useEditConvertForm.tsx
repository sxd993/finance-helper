import { useForm } from "react-hook-form"
import { useEditConvert } from "./useEditConvert";
import type { EditConvertPayload } from "./type";

export const useEditConvertForm = (opt: EditConvertPayload) => {
    const { mutateEditConvert, isPending, error } = useEditConvert();
    const { register, handleSubmit, reset, formState } = useForm<EditConvertPayload>({
        defaultValues: {
            id: opt.id,
            name: opt.name,
            overall_limit: opt.overall_limit,
            target_amount: opt.target_amount ?? opt.overall_limit ?? null,
        }
    });

    const onSubmit = handleSubmit(async (data: EditConvertPayload) => {
        const payload: EditConvertPayload = {
            ...data,
            target_amount: data.target_amount ?? data.overall_limit ?? null,
        };
        await mutateEditConvert(payload)
        reset(payload)
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
