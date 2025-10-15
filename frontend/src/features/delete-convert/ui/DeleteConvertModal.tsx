import { Button } from "@/shared/ui/Button";
import { useDeleteConvert } from "../model/useDeleteConvert";
import { AlertTriangle } from "lucide-react";

interface DeleteConvertModalProps {
    id: number;
    name: string;
    onClose: () => void;
}

export const DeleteConvertModal = ({ id, name, onClose }: DeleteConvertModalProps) => {
    const { handleDeleteConvert, isPending } = useDeleteConvert();

    return (
        <div className="flex flex-col items-center w-full gap-6 px-4 py-6 text-center">
            <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-lg text-slate-800">
                        Вы действительно хотите удалить конверт {name}?
                    </p>
                </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button
                    title={isPending ? "Удаление..." : "Удалить"}
                    text="white"
                    bg="primary"
                    disabled={isPending}
                    onClick={async () => {
                        await handleDeleteConvert(id);
                        onClose();
                    }}
                />
                <Button
                    title="Отменить"
                    bg="white"
                    text="black"
                    onClick={onClose}
                />
            </div>
        </div>
    );
};
