import type { createIncomeData } from "@/entities/expense"
import { useForm } from "react-hook-form"
import { useCreateIncomeMutation } from "@/entities/expense"

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
