import type { Remainder } from "@entities/remainders"

interface RemainderCardProps {
    remainder: Remainder
}

export const RemainderCard = ({ remainder }: RemainderCardProps) => {
    return (
        <div className="p-2 bg-white border border-slate-200 rounded-2xl">
            <div>иконка</div>
            <div><p>{remainder.start_date} - {remainder.end_date}</p></div>
            <span className="text-lg text-green-500">{remainder.amount}</span>
        </div>
    )
}