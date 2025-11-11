import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import type { Expense } from "@/entities/expense/model/types"
import { GetUserExpenses } from "../api/GetUserExpenses"
import { groupExpensesByDate } from "../lib/groupExpensesByDate"

export const useUserExpenses = () => {

    const convertType = useSelector((state: RootState) => state.expenses_filters.convert_type.value)

    const { data = [], error, isLoading } = useQuery<Expense[]>({
        queryKey: ["userExpenses", convertType],
        queryFn: () => GetUserExpenses({ convert_type: convertType }),
    })

    const expenseGroups = useMemo(() => groupExpensesByDate(data), [data])

    return { expenses: data, expenseGroups, error, isLoading }
}
