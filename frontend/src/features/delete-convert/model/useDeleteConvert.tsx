import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteConvert } from "@/entities/convert/api/deleteConvert";

export const useDeleteConvert = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["delete-convert"],
        mutationFn: deleteConvert,
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success("Конверт успешно удален");
        },
        onError:  () => {
            toast.error('Конверт не был создан')
        }
    });

    const handleDeleteConvert = async (id: number) => {
        await mutation.mutateAsync(id);
    };

    return {
        handleDeleteConvert,
        isSuccess: mutation.isSuccess,
        isPending: mutation.isPending,
        error: mutation.error,
    };
};
