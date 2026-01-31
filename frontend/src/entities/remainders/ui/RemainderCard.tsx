import { PieChart } from "lucide-react"
import type { Remainder } from "@entities/remainders"

interface RemainderCardProps {
    remainder: Remainder
}

export const RemainderCard = ({ remainder }: RemainderCardProps) => {
    return (
        <div className="flex items-center gap-4 p-2 bg-white border border-slate-200 rounded-2xl">
            <PieChart className="text-slate-500" size={28} strokeWidth={1.5} />
            <div className="flex flex-col">
                <p className="text-sm text-slate-500">{remainder.start_date} - {remainder.end_date}</p>
                <span className="text-lg font-semibold text-green-500">{remainder.amount}</span>
            </div>
        </div>
    )
}
