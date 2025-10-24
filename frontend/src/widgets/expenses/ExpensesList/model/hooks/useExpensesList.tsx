import { useQuery } from "@tanstack/react-query"
import { getUserExpenses } from "@/entities/expense/api/expenseApi"
import type { Expense } from "@/entities/expense/model/types"

export const useExpensesList = () => {
    const { data, error, isLoading } = useQuery<Expense[]>({
        queryKey: ['userExpenses'],
        queryFn: getUserExpenses,
    })

    return {
        expenses: data ?? [],
        error,
        isLoading,
    }
}
