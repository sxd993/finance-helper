import { formatPrice } from "@/shared/utils/formatPrice"
import type { UseUserConvertsLimitsResult } from "@/features/converts/get-user-converts-limits/model/types"
import { TypeCard } from "./TypeCard"
import { useConvertTypes } from "@/features/converts/get-convert-types"

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
    const { convert_types } = useConvertTypes();

    if (!data || data.length === 0) {
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
            {data.map((item) => {
                const { typeCode } = item
                const typeInfo = convert_types.find(c => c.code === typeCode)
                const description = typeInfo?.description

                switch (typeCode) {
                    case "important":
                    case "wishes": {
                        const limitAmount = item.distributedAmount + item.limitAmount
                        const distributedAmount = item.distributedAmount
                        const remainderAmount = limitAmount - distributedAmount

                        return (
                            <TypeCard
                                key={typeCode}
                                title={typeCode === "important" ? "Важные расходы" : "Желания"}
                                description={description}
                                items={[
                                    { label: "Лимит", value: formatPrice(limitAmount) },
                                    { label: "Распределено", value: formatPrice(distributedAmount) },
                                    { label: "Остаток", value: formatPrice(remainderAmount) },
                                ]}
                            />
                        )
                    }

                    case "saving":
                        return (
                            <TypeCard
                                key={typeCode}
                                title="Сбережения"
                                description={description}
                                items={[]}
                            />
                        )

                    case "investment":
                        return (
                            <TypeCard
                                key={typeCode}
                                title="Инвестиции"
                                description={description}
                                items={[]}
                            />
                        )

                    default:
                        return (
                            <TypeCard
                                key={typeCode}
                                title={`Тип: ${typeCode}`}
                                description={description}
                                items={[]}
                            />
                        )
                }
            })}
        </div>
    )
}