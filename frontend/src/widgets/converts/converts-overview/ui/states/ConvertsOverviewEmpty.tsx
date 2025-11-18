import { formatTypeCode } from "@/entities/convert"
import { CalendarDays, Sparkles } from "lucide-react"

interface ConvertsOverviewEmptyProps {
    resetInDays?: number
    type_code: string
}

export const ConvertsOverviewEmpty = ({ resetInDays = 5, type_code }: ConvertsOverviewEmptyProps) => {
    const convert_type = formatTypeCode(type_code)
    return (
        <div className="rounded-2xl border border-emerald-100 to-white p-6 shadow-inner bg-white">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                    <p className="text-lg font-semibold text-gray-900">
                        Отличная работа!
                    </p>
                    <p className="text-sm text-gray-600">
                        Вы распределили все средства, которые выделили на {convert_type}.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white font-medium shadow-sm">
                        <CalendarDays className="w-4 h-4" />
                        Сброс через <span className="text-emerald-700">{resetInDays} дней</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
