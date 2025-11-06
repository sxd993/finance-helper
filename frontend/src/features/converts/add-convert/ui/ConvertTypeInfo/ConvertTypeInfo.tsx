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
                const description = convert_types.filter(c => c.code === typeCode)

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
                                items={[]}
                            />
                        )

                    case "investment":
                        return (
                            <TypeCard
                                key={typeCode}
                                title="Инвестиции"
                                items={[]}
                            />
                        )

                    default:
                        return (
                            <TypeCard
                                key={typeCode}
                                title={`Тип: ${typeCode}`}
                                items={[]}
                            />
                        )
                }
            })}
        </div>
    )
}