import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DeleteExpense } from "../api/DeleteExpense";

interface DeleteExpenseErrorResponse {
  message?: string;
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-expense"],
    mutationFn: DeleteExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userExpenses"] }),
        queryClient.invalidateQueries({ queryKey: ["history"] }),
        queryClient.invalidateQueries({ queryKey: ["converts"] }),
        queryClient.invalidateQueries({ queryKey: ["limits"] }),
        queryClient.invalidateQueries({ queryKey: ["converts", "limits"] }),
      ]);
      toast.success("Расход удалён");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<DeleteExpenseErrorResponse>;
      toast.error(axiosError.response?.data?.message ?? "Не удалось удалить расход");
    },
  });

  const deleteExpense = async (id: number) => {
    await mutation.mutateAsync(id);
  };

  return {
    deleteExpense,
    isPending: mutation.isPending,
  };
};
