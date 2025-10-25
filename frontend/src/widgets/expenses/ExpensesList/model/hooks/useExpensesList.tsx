import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/providers"
import { getUserExpenses } from "@/entities/expense/api/expenseApi"
import type { Expense } from "@/entities/expense/model/types"
import { groupExpensesByDate } from "../../lib/groupExpensesByDate"

export const useExpensesList = () => {

  const convertType = useSelector((state: RootState) => state.expenses_filters.convert_type.value)

  const { data = [], error, isLoading } = useQuery<Expense[]>({
    queryKey: ["userExpenses", convertType],
    queryFn: () => getUserExpenses({ convert_type: convertType }),
  })

  const expenseGroups = useMemo(() => groupExpensesByDate(data), [data])

  return { expenses: data, expenseGroups, error, isLoading }
}
