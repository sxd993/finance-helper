import type { Convert } from "../model/types"

type ConvertCardProps = {
    convert: Convert
}

export const ConvertCard = ({ convert }: ConvertCardProps) => {
    return (
        <div className="rounded-md border p-3 flex flex-col gap-1">
            <div className="text-lg font-semibold">{convert.name}</div>
            {(convert.current_amount !== undefined || convert.target_amount !== undefined) && (
                <div className="text-sm text-gray-700">
                    {convert.current_amount !== undefined && <span>Текущая сумма: {convert.current_amount}</span>}
                    {convert.current_amount !== undefined && convert.target_amount !== undefined && <span> · </span>}
                    {convert.target_amount !== undefined && <span>Target: {convert.target_amount}</span>}
                </div>
            )}
        </div>
    )
}
