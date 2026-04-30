import type { Convert } from "@/entities/convert"
import { formatPrice } from "@/shared/utils/formatPrice"
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

export const InvestmentConvertCard = ({ convert }: Props) => {
    const { isOpen, open, close } = useModal(`delete-convert-${convert.id}`)
    const { isOpen: isReplenishOpen, open: openReplenish, close: closeReplenish } = useModal(`replenish-convert-${convert.id}`)
    const palette = getConvertTypePalette(convert.type_code)
    const invested = formatPrice(convert.invested_amount ?? 0)
    const current = formatPrice(convert.current_value ?? 0)
    const baseValue = convert.invested_amount ?? 0
    const currentValue = convert.current_value ?? 0

    const diff = baseValue ? Math.round(((currentValue - baseValue) / baseValue) * 100) : 0
    const diffLabel = diff > 0 ? `+${diff}%` : `${diff}%`
    const diffColor = diff >= 0 ? "text-emerald-600" : "text-red-600"

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

                <div className="space-y-2">
                    <Row label="Инвестировано" value={invested} />
                    <Row label="Баланс" value={current} isPrimary />
                    <Row label="Доходность" value={<span className={`font-semibold ${diffColor}`}>{diffLabel}</span>} />
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
                    initialSourceType="investment"
                    initialConvertId={convert.id}
                    initialConvertName={convert.name}
                    onSuccess={closeReplenish}
                />
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
