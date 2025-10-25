import { useMemo } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { getUserExpenses } from "@/entities/expense/api/expenseApi"
import type { Expense } from "@/entities/expense/model/types"

export const useExpensesList = () => {
    const { data, error, isLoading } = useQuery<Expense[]>({
        queryKey: ['userExpenses'],
        queryFn: getUserExpenses,
    })

    const expenseGroups = useMemo(() => {
        if (!data?.length) {
            return []
        }

        const groups = new Map<
            string,
            { label: string; items: Expense[]; timestamp: number }
        >()

        data.forEach((expense) => {
            const normalizedTimestamp =
                expense.date > 1_000_000_000_000
                    ? expense.date
                    : expense.date * 1000
            const expenseDate = new Date(normalizedTimestamp)
            const timestamp = expenseDate.getTime()
            const hasValidDate = !Number.isNaN(timestamp)
            const dateKey = hasValidDate
                ? format(expenseDate, "yyyy-MM-dd")
                : String(expense.date)
            const label = hasValidDate
                ? format(expenseDate, "d MMMM yyyy", { locale: ru })
                : "Неизвестная дата"

            const group = groups.get(dateKey)

            if (group) {
                group.items.push(expense)
            } else {
                groups.set(dateKey, {
                    label,
                    items: [expense],
                    timestamp: hasValidDate ? timestamp : 0,
                })
            }
        })

        const mappedGroups = Array.from(groups.entries()).map(
            ([dateKey, group]) => ({
                dateKey,
                label: group.label,
                items: group.items.slice().sort((a, b) => b.date - a.date),
                timestamp: group.timestamp,
            }),
        )

        mappedGroups.sort((a, b) => b.timestamp - a.timestamp)

        return mappedGroups.map(({ timestamp, ...group }) => group)
    }, [data])

    return {
        expenses: data ?? [],
        expenseGroups,
        error,
        isLoading,
    }
}
