import type { Convert } from "@/entities/convert"
import { Modal } from "@/shared/ui/Modal"
import { formatPrice } from "@/shared/utils/formatPrice"
import { Edit2, Trash } from "lucide-react"
import { EditConvertModal } from "./EditConvertModal"
import { useModal } from "@/shared/ui/Modal/model/useModal"

interface EditConvertCardProps {
    convert: Convert
}


export const EditConvertCard = ({ convert }: EditConvertCardProps) => {
    const { isOpen, open, close } = useModal(`edit-convert-${convert.id}`);
    return (
        <>
            <div key={convert.id} className="flex flex-row justify-between bg-gray-50 border border-slate-200 px-2 py-4 rounded-xl">
                <div className="flex flex-col items-start gap-1 ml-3">
                    <h1 className=" text-lg">{convert.name}</h1>
                    <div className="flex gap-1">
                        <span className="text-md text-gray-600">{convert?.overall_limit ? 'Лимит:' : 'Цель:'}</span>
                        <span>{formatPrice(convert?.overall_limit) || formatPrice(convert.target_amount)}</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-md text-gray-600">{convert?.initial_investment ? 'Инвестиции' : 'Баланс'}</span>
                        <span>{formatPrice(convert?.initial_investment || convert?.current_amount)}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-center mr-3">
                    <button
                        onClick={open}
                        className="flex text-sm items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 min-w-[110px]">
                        <Edit2 className="w-4 h-4" />
                        Изменить
                    </button>
                    <button className="flex text-sm items-center justify-center rounded-xl p-2 gap-2 border border-slate-200 hover:bg-red-500 hover:text-white text-red-500 min-w-[110px]">
                        <Trash className="w-4 h-4" />
                        Удалить
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={close}
            >
                <EditConvertModal
                    id={convert.id}
                    name={convert.name}
                    overall_limit={convert.overall_limit}
                    current_amount={convert.current_amount}
                    convert_type_limit={convert.type.limit}
                />
            </Modal>
        </>
    )
}
