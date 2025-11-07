import type { UseUserConvertsLimitsResult } from "@/features/converts/get-user-converts-limits/model/types"
import { TypeCard } from "./TypeCard"
import { useConvertTypeInfoData } from "@/features/converts/add-convert/model/hooks/useConvertTypeInfoData"

interface Props {
    data?: UseUserConvertsLimitsResult["userConvertsLimits"]
    fallbackTitle?: string
    fallbackDescription?: string
}

export const ConvertTypeInfo = ({
    data,
    fallbackTitle = "Информация о типе",
    fallbackDescription = "Выберите тип конверта, чтобы увидеть доступные лимиты и рекомендации.",
}: Props) => {
    const { cards, hasData } = useConvertTypeInfoData(data)

    if (!hasData) {
        return (
            <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-left shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">{fallbackTitle}</h2>
                {fallbackDescription && (
                    <p className="mt-1 text-sm text-slate-600">{fallbackDescription}</p>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {cards.map((card) => (
                <TypeCard
                    key={card.key}
                    title={card.title}
                    description={card.description}
                    items={card.items}
                />
            ))}
        </div>
    )
}
