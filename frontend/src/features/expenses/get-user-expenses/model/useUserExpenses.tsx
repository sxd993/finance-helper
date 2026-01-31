import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { GetUserExpenses, type GetUserExpensesResponse } from "../api/GetUserExpenses"
import { groupExpensesByDate } from "../lib/groupExpensesByDate"
import { formatPrice } from "@/shared/utils/formatPrice"

export const useUserExpenses = () => {

    const convertType = useSelector((state: RootState) => state.expenses_filters.convert_type.value)

    const { data, error, isLoading } = useQuery<GetUserExpensesResponse>({
        queryKey: ["userExpenses", convertType],
        queryFn: () => GetUserExpenses({ convert_type: convertType }),
    })

    const expenses = data?.expenses ?? []
    const currentCycleSpent = formatPrice(data?.current_cycle_spent)

    const expenseGroups = useMemo(() => groupExpensesByDate(expenses), [expenses])

    return { expenses, expenseGroups, currentCycleSpent, error, isLoading }
}
