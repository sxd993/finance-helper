import { useConvertCardMetrics } from "@/entities/convert/model/useConvertCardMetrics"
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { ProgressBar } from "@/shared/ui/ProgressBar"
import { CalendarDays, Settings } from "lucide-react"
import { useHasConvertRemainder } from "@/shared/hooks/useHasConvertRemainder"
import { Link } from "react-router-dom"

interface Props {
    convert: UserConvertLimit
}

export const ConvertOverviewCard = ({ convert }: Props) => {
    const { percentage, remainderAmount, title, typeCode, limitAmount, progressColor } = useConvertCardMetrics({ convert })
    const hasRemainder = useHasConvertRemainder(typeCode)
    const color = progressColor(typeCode)
    const editPath = `/converts/edit/${typeCode}`
    const canSpend = convert.typeCode === 'wishes' || convert.typeCode === 'important'

    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow bg-slate-50`}>
                                {renderConvertIcon(typeCode)}
                            </div>
                            <span className="text-gray-900 text-lg">
                                {title}
                            </span>
                        </div>
                        <Link
                            to={editPath}
                            className="px-2 py-1 text-md font-semibold text-black bg-slate-100 rounded-lg"
                        >
                            <Settings />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Остаток</p>
                                <p className="text-gray-900 text-lg font-semibold">
                                    {remainderAmount}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">Лимит</p>
                                <p className="text-gray-900 text-sm">{limitAmount}</p>
                            </div>
                        </div>
                        <ProgressBar
                            color={color}
                            percentage={percentage}
                        />

                        <div className="flex items-center justify-between text-xs pt-1 gap-2">
                                {hasRemainder && (
                                    <span className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg ≈">
                                        {canSpend ? 'Можно распределить средства' : 'Можно перевести в конверты'}
                                    </span>
                                )}
                            <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1.5  max-w-1/2 text-wrap">
                                <CalendarDays className="w-4 h-4" />
                                {canSpend ? 'Сброс через 5 дней' : 'Пополнение через 5 дней'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
