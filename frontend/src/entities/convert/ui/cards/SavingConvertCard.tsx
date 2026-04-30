import type { Convert } from "@/entities/convert"
import { formatPrice } from "@/shared/utils/formatPrice"
import { ProgressBar } from "@/shared/ui/ProgressBar"
import { Modal } from "@/shared/ui/Modal"
import { useModal } from "@/shared/ui/Modal/model/useModal"
import { DeleteConvertModal } from "@/features/converts/delete-convert"
import { ReplenishConvertForm } from "@/features/converts/replenish-convert"
import { Button } from "@/shared/ui/Button"
import { getConvertTypePalette } from "@/entities/convert"
import { Plus, Trash } from "lucide-react"

interface Props {
    convert: Convert
}

export const SavingConvertCard = ({ convert }: Props) => {
    const { isOpen, open, close } = useModal(`delete-convert-${convert.id}`)
    const { isOpen: isReplenishOpen, open: openReplenish, close: closeReplenish } = useModal(`replenish-convert-${convert.id}`)
    const palette = getConvertTypePalette(convert.type_code)
    const targetValue = convert.goal_amount ?? 0
    const remainderValue = convert.saved_amount ?? 0
    const remainder = formatPrice(remainderValue) ?? '0 ₽'
    const goal = formatPrice(targetValue) ?? '0 ₽'
    const progress = targetValue
        ? Math.min(100, Math.max(0, Math.round((remainderValue / targetValue) * 100)))
        : 0

    return (
        <>
            <div className={`relative rounded-2xl border ${palette.border} bg-white/80 backdrop-blur-sm p-5 shadow-[0_4px_20px_-6px_rgb(0,0,0,0.08)]`}>
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${palette.bg} rounded-l-2xl`} />

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{convert.name}</h3>

                    <div className="flex items-center gap-2">
                        <Button
                            title="Пополнить"
                            size="sm"
                            onClick={openReplenish}
                            leftIcon={<Plus className="w-4 h-4" />}
                            className="gap-2"
                        />
                        <button
                            type="button"
                            aria-label={`Удалить конверт ${convert.name}`}
                            onClick={open}
                            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <Row label="Накоплено" value={remainder} isPrimary />
                    <Row label="Цель" value={goal} />
                </div>

                <div>
                    <div className="text-xs text-slate-500 mb-1">{progress}%</div>
                    <ProgressBar color={palette.bg} percentage={progress} />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={close}>
                <DeleteConvertModal id={convert.id} name={convert.name} onClose={close} />
            </Modal>

            <Modal
                isOpen={isReplenishOpen}
                onClose={closeReplenish}
                title="Пополнение конверта"
                widthClassName="max-w-xl"
            >
                <ReplenishConvertForm
                    initialSourceType="saving"
                    initialConvertId={convert.id}
                    initialConvertName={convert.name}
                    onSuccess={closeReplenish}
                />
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
