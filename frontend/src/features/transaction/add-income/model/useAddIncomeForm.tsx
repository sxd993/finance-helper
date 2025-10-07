import type { createIncomeData } from "@/entities/transaction/model/types"
import { useForm } from "react-hook-form"
import { useCreateIncomeMutation } from "@/entities/transaction/model/useCreateIncomeMutation"

export const useAddIncomeForm = () => {

    const addIncomeMutatation = useCreateIncomeMutation();

    const form = useForm<createIncomeData>({
        defaultValues: {
            title: '',
            amount: 0
        }
    })

    const onSubmit = async (data: createIncomeData) => {
        addIncomeMutatation.mutateAsync(data)
    }
    return {
        form,
        onSubmit
    }
}