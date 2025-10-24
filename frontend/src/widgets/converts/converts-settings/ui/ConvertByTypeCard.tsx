import type { Convert, ConvertInfo } from "@/entities/convert";
import { Modal } from "@/shared/ui/Modal";
import { formatPrice } from "@/shared/utils/formatPrice";
import { Edit2, Trash } from "lucide-react";
import { EditConvertModal } from "../../../../features/edit-convert";
import { useModal } from "@/shared/ui/Modal/model/useModal";
import { DeleteConvertModal } from "@/features/delete-convert";

interface ConvertByTypeCardProps {
    convert: Convert;
    overviewInfo?: ConvertInfo | null;
}

export const ConvertByTypeCard = ({ convert, overviewInfo }: ConvertByTypeCardProps) => {
    const {
        isOpen: isEditOpen,
        open: openEditModal,
        close: closeEditModal,
    } = useModal(`edit-convert-${convert.id}`);
    const {
        isOpen: isDeleteOpen,
        open: openDeleteModal,
        close: closeDeleteModal,
    } = useModal(`delete-convert-${convert.id}`);

    return (
        <>
            <div className="flex flex-row justify-between bg-gray-50 border border-slate-200 px-2 py-4 rounded-xl">
                <div className="flex flex-col items-start gap-1 ml-3">
                    <h1 className=" text-lg">{convert.name}</h1>
                    <div className="flex gap-1">
                        <span className="text-md text-gray-600">{convert?.overall_limit ? "Лимит:" : "Цель:"}</span>
                        <span>{formatPrice(convert?.overall_limit) || formatPrice(convert.target_amount)}</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-md text-gray-600">
                            {(convert?.initial_amount ?? convert?.initial_investment) ? "Инвестиции" : "Баланс"}:
                        </span>
                        <span>{formatPrice((convert?.initial_amount ?? convert?.initial_investment) || convert?.balance || convert?.current_amount)}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-between items-center mr-3">
                    <button
                        onClick={openEditModal}
                        className="flex text-sm items-center justify-center gap-2 border border-slate-200 rounded-xl p-2 min-w-[110px]">
                        <Edit2 className="w-4 h-4" />
                        Изменить
                    </button>
                    <button
                        onClick={openDeleteModal}
                        className="flex text-sm items-center justify-center rounded-xl p-2 gap-2 border border-slate-200 hover:bg-red-500 hover:text-white text-red-500 min-w-[110px]">
                        <Trash className="w-4 h-4" />
                        Удалить
                    </button>
                </div>
            </div>
            <Modal
                title={`Изменение конверта: ${convert.name}`}
                isOpen={isEditOpen}
                onClose={closeEditModal}
            >
                <EditConvertModal
                    id={convert.id}
                    name={convert.name}
                    overall_limit={convert.overall_limit}
                    current_amount={convert.current_amount}
                    target_amount={convert.target_amount}
                    convert_type_limit={convert.type?.limit ?? overviewInfo?.total_limit ?? null}
                    convert_type_used={overviewInfo?.used_limit ?? null}
                    convert_type_available={overviewInfo?.avaliable_limit ?? null}
                    onClose={closeEditModal}
                />
            </Modal>
            <Modal
                isOpen={isDeleteOpen}
                onClose={closeDeleteModal}
            >
                <DeleteConvertModal
                    id={convert.id}
                    name={convert.name}
                    onClose={closeDeleteModal}
                />
            </Modal>
        </>
    );
};
