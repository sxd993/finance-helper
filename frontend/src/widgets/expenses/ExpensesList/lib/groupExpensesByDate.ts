import { format } from "date-fns"
import { ru } from "date-fns/locale"
import type { Expense } from "@/entities/expense"

export interface ExpenseGroup {
    label: string
    items: Expense[]
    timestamp: number
}

export const groupExpensesByDate = (expenses: Expense[]): ExpenseGroup[] => {
    const groups = new Map<string, ExpenseGroup>()

    for (const expense of expenses) {
        const date = new Date(
            expense.date > 1_000_000_000_000 ? expense.date : expense.date * 1000
        )

        const valid = !isNaN(date.getTime())
        const key = valid ? format(date, "yyyy-MM-dd") : String(expense.date)
        const label = valid ? format(date, "d MMMM yyyy", { locale: ru }) : "Неизвестная дата"

        if (!groups.has(key)) {
            groups.set(key, { label, items: [], timestamp: valid ? date.getTime() : 0 })
        }

        groups.get(key)!.items.push(expense)
    }

    return [...groups.values()]
        .map((g) => ({
            label: g.label,
            items: g.items.sort((a, b) => b.date - a.date),
            timestamp: g.timestamp,
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
}
