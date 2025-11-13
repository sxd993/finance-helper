import type { Convert } from "@/entities/convert"
import { formatPrice } from "@/shared/utils/formatPrice"
import { Modal } from "@/shared/ui/Modal"
import { useModal } from "@/shared/ui/Modal/model/useModal"
import { DeleteConvertModal } from "@/features/converts/delete-convert"
import { Trash } from "lucide-react"

interface Props {
    convert: Convert
}

export const InvestmentConvertCard = ({ convert }: Props) => {
    const { isOpen, open, close } = useModal(`delete-convert-${convert.id}`)
    const invested = formatPrice(convert.initial_amount ?? 0)
    const current = formatPrice(convert.target_amount ?? 0)
    const baseValue = convert.initial_amount ?? 0
    const currentValue = convert.target_amount ?? 0

    const diff = baseValue ? Math.round(((currentValue - baseValue) / baseValue) * 100) : 0
    const diffLabel = diff > 0 ? `+${diff}%` : `${diff}%`
    const diffColor = diff >= 0 ? "text-emerald-600" : "text-red-600"

    return (
        <>
            <div className="relative rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-5 shadow-[0_4px_20px_-6px_rgb(0,0,0,0.08)]">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-l-2xl" />

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{convert.name}</h3>

                    <button
                        type="button"
                        aria-label={`Удалить конверт ${convert.name}`}
                        onClick={open}
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    <Row label="Инвестировано" value={invested} />
                    <Row label="Баланс" value={current} isPrimary />
                    <Row label="Доходность" value={<span className={`font-semibold ${diffColor}`}>{diffLabel}</span>} />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={close}>
                <DeleteConvertModal id={convert.id} name={convert.name} onClose={close} />
            </Modal>
        </>
    )
}

const Row = ({ label, value, isPrimary }: { label: string; value: any; isPrimary?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={isPrimary ? "font-semibold text-slate-900" : "text-slate-700"}>{value}</span>
    </div>
)
