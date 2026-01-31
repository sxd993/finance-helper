import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteConvert } from "../api/DeleteConvert";

export const useDeleteConvert = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["delete-convert"],
        mutationFn: DeleteConvert,
        onSuccess: async () => {
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ['converts'] }),
                queryClient.refetchQueries({ queryKey: ['limits'] }),
                queryClient.refetchQueries({ queryKey: ['converts', 'limits'] }),
            ]);
            toast.success("Конверт успешно удален");
        },
        onError: (error) => {
            toast.error(error?.response.data.message || "Ошибка при удалении конверта");
            console.log(error)
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
