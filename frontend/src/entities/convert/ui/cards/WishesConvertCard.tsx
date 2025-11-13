import type { Convert } from "@/entities/convert"
import { formatPrice } from "@/shared/utils/formatPrice"
import { ProgressBar } from "@/shared/ui/ProgressBar"
import { Modal } from "@/shared/ui/Modal"
import { useModal } from "@/shared/ui/Modal/model/useModal"
import { DeleteConvertModal } from "@/features/converts/delete-convert"
import { Trash } from "lucide-react"

interface Props {
    convert: Convert
}

export const WishesConvertCard = ({ convert }: Props) => {
    const { isOpen, open, close } = useModal(`delete-convert-${convert.id}`)
    const limitValue = convert.target_amount ?? 0
    const remainderValue = convert.current_balance ?? 0
    const remainder = formatPrice(remainderValue)
    const limit = formatPrice(limitValue)
    const progress = limitValue
        ? Math.min(100, Math.max(0, Math.round((remainderValue / limitValue) * 100)))
        : 0

    return (
        <>
            <div className="relative rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-5 shadow-[0_4px_20px_-6px_rgb(0,0,0,0.08)]">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-500 rounded-l-2xl" />

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

                <div className="space-y-2 mb-4">
                    <Row label="Остаток" value={remainder} isPrimary />
                    <Row label="Лимит" value={limit} />
                </div>

                <div>
                    <div className="text-xs text-slate-500 mb-1">{progress}%</div>
                    <ProgressBar color="bg-yellow-500" percentage={progress} />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={close}>
                <DeleteConvertModal id={convert.id} name={convert.name} onClose={close} />
            </Modal>
        </>
    )
}

const Row = ({ label, value, isPrimary }: { label: string; value: string; isPrimary?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={isPrimary ? "font-semibold text-slate-900" : "text-slate-700"}>{value}</span>
    </div>
)
