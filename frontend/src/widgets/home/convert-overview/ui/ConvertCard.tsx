import { formatPrice } from "@/shared/utils/formatPrice"

interface ConvertCardProps {
    type: string;
    currentSum: number;
    totalSum?: number;
    icon?: string
}

export const ConvertCard = ({
    type,
    currentSum,
    totalSum,
    icon }: ConvertCardProps) => {
    return (
        <div className="shadow-sm rounded-2xl border-1 border-slate-200">
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{icon}</span>
                        <h3>{type}</h3>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">{formatPrice(currentSum)}</p>
                        {totalSum || totalSum === 0 && (
                            <p className="text-xs text-muted-foreground"> из {formatPrice(totalSum)}</p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                </div>
            </div>
        </div>
    )
}