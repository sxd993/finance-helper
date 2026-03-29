import { useConvertCardMetrics } from "@/entities/convert/model/useConvertCardMetrics"
import type { UserConvertLimit } from "@/features/converts/get-user-converts-limits/model/types"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { ProgressBar } from "@/shared/ui/ProgressBar"
import { Clock3 } from "lucide-react"
import { ConvertsOverviewEmpty } from "./states/ConvertsOverviewEmpty"
import { useRemainingDays } from "@/features/cycles"

interface Props {
    convert: UserConvertLimit
    isHasRemainder: boolean
}

export const ConvertOverviewCard = ({ convert, isHasRemainder }: Props) => {

    const { percentage, remainderAmount, title, typeCode, limitAmount, progressColor } = useConvertCardMetrics({ convert })
    const { remainingDays } = useRemainingDays();

    const color = progressColor(typeCode)
    const canSpend = convert.typeCode === 'wishes' || convert.typeCode === 'important'
    const scheduleLabel = canSpend ? 'Сброс' : 'Пополнение'

    if (isHasRemainder) {
        return (
            <ConvertsOverviewEmpty
                resetInDays={remainingDays}
            />
        )
    }


    return (
        <div className="group">
            <div className="rounded-2xl border border-slate-200 bg-white transition-shadow duration-300 shadow-sm group-hover:shadow-md">
                <div className="p-6 space-y-4">
                    <div className="flex items-start">
                        <div className="flex items-center gap-1">
                            <div className={`rounded-lg flex items-center justify-center`}>
                                {renderConvertIcon(typeCode)}
                            </div>
                            <span className="text-gray-900 text-lg">
                                {title}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">Доступно</p>
                            <p className="text-2xl font-semibold leading-none text-slate-900">
                                {remainderAmount}
                            </p>
                        </div>
                        <ProgressBar
                            color={color}
                            percentage={percentage}
                        />
                        <p className="text-sm text-slate-500">
                            Лимит: <span className="font-medium text-slate-700">{limitAmount}</span>
                        </p>

                        <div className="flex items-center justify-between pt-1 gap-2">
                            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700">
                                <Clock3 className="h-5 w-5 text-slate-500" />
                                <span className="text-sm font-medium">
                                    {scheduleLabel} через {remainingDays} дней
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
