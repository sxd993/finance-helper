import { formatPrice } from "@/shared/utils/formatPrice"
import { useUserConvertsLimits } from "../model/useUserConvertsLimits"

const SUPPORTED_TYPES = new Set<string>(["important", "wishes"])

interface Props {
    typeCode?: string | null
}

export const ConvertLimitCard = ({ typeCode }: Props) => {
    const { userConvertsLimits, isLoading } = useUserConvertsLimits()

    if (!typeCode || !SUPPORTED_TYPES.has(typeCode)) return null

    const convertLimit = userConvertsLimits?.find((convert) => convert.typeCode === typeCode)

    if (isLoading) {
        return (
            <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-500">Загружаем лимиты...</p>
            </div>
        )
    }

    if (!convertLimit) {
        return (
            <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-500">Лимиты для выбранного типа конверта не найдены.</p>
            </div>
        )
    }

    const limit = formatPrice(convertLimit.limitAmount) ?? "—"
    const unspent = formatPrice(convertLimit.availableToSpend) ?? "—"

    return (
        <div className="w-full">
            <div className="flex justify-between gap-3 text-sm">
                <div className="flex min-w-1/2 flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <span className="text-xs uppercase text-slate-500">Непотрачено</span>
                    <span className="text-base font-semibold text-emerald-600">{unspent}</span>
                </div>
                <div className="flex min-w-1/2 flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <span className="text-xs uppercase text-slate-500">Общий лимит</span>
                    <span className="text-base font-semibold text-slate-900">{limit}</span>
                </div>
            </div>
        </div>
    )
}
