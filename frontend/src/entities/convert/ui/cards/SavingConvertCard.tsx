import type { Convert } from "@/entities/convert"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { formatPrice } from "@/shared/utils/formatPrice"
import { ProgressBar } from "@/shared/ui/ProgressBar"

interface Props {
    convert: Convert
}

export const SavingConvertCard = ({ convert }: Props) => {
    const targetValue = convert.target_amount ?? convert.initial_amount ?? 0
    const remainderValue = convert.current_balance ?? 0
    const remainder = formatPrice(remainderValue)
    const goal = formatPrice(targetValue)
    const progress = targetValue
        ? Math.min(100, Math.max(0, Math.round((remainderValue / targetValue) * 100)))
        : 0

    return (
        <div className="relative rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-5 shadow-[0_4px_20px_-6px_rgb(0,0,0,0.08)]">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500 rounded-l-2xl" />

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{convert.name}</h3>

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    {renderConvertIcon(convert.type_code)}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <Row label="Накоплено" value={remainder} isPrimary />
                <Row label="Цель" value={goal} />
            </div>

            <div>
                <div className="text-xs text-slate-500 mb-1">{progress}%</div>
                <ProgressBar color="bg-green-500" percentage={progress} />
            </div>
        </div>
    )
}

const Row = ({ label, value, isPrimary }: { label: string; value: string; isPrimary?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={isPrimary ? "font-semibold text-slate-900" : "text-slate-700"}>{value}</span>
    </div>
)
