import { CalendarDays } from "lucide-react"

interface ConvertsOverviewEmptyProps {
    resetInDays?: number
}

export const ConvertsOverviewEmpty = ({ resetInDays }: ConvertsOverviewEmptyProps) => {
    return (
        <div className="bg-white px-6 py-4 border border-slate-200 rounded-2xl">
            <div className="flex flex-col items-center text-center gap-3">
                <p className="text-base text-slate-700 leading-relaxed">
                    Средства по этой категории распределены.
                </p>
                <div className="flex items-center gap-2 text-base text-slate-700  border border-slate-200 px-3 py-1.5 rounded-full">
                    <CalendarDays className="w-4 h-4" />
                    <span>Сброс через {resetInDays} дней</span>
                </div>
            </div>
        </div>
    )
}
