import { RenderConvertIcon } from "@/shared/ui/RenderConvertIcon";
import { formatPrice } from "@/shared/utils/formatPrice"

interface ConvertCardProps {
    type: string;
    currentSum: number;
    totalSum?: number;
    code: string
}

export const ConvertCard = ({
    type,
    currentSum,
    code
}: ConvertCardProps) => {
    return (
        <div className="shadow-sm rounded-2xl border-1 border-slate-200">
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        {RenderConvertIcon(code)}
                        <h3>{type}</h3>
                    </div>
                    <div className="flex">
                        <p className="font-medium">{formatPrice(currentSum)}</p>
                    </div>
                </div>
                <div className="space-y-2">
                </div>
            </div>
        </div>
    )
}