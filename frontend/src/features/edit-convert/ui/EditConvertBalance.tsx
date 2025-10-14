import { formatPrice } from "@/shared/utils/formatPrice"

export const EditConvertBalance = () => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Всего средств</p>
                <p className="text-2xl">{formatPrice(53000)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-muted-foreground mb-1">Общий лимит</p>
                <p className="text-2xl">{formatPrice(60000)}</p>
            </div>
        </div>
    )
}