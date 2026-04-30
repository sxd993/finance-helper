import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Expense } from "@/entities/expense";

import { EditExpense } from "../api/EditExpense";

interface EditExpenseErrorResponse {
  message?: string;
  code?: string;
  available?: number;
  requested?: number;
}

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<EditExpenseErrorResponse>;
  const payload = axiosError.response?.data;

  if (payload?.code === "EXPENSE_EXCEEDS_BALANCE") {
    return payload.message ?? "Сумма траты превышает доступный остаток конверта";
  }

  return payload?.message ?? "Не удалось обновить расход";
};

export const useEditExpense = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["edit-expense"],
    mutationFn: EditExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userExpenses"] }),
        queryClient.invalidateQueries({ queryKey: ["history"] }),
        queryClient.invalidateQueries({ queryKey: ["converts"] }),
        queryClient.invalidateQueries({ queryKey: ["limits"] }),
        queryClient.invalidateQueries({ queryKey: ["converts", "limits"] }),
      ]);
      toast.success("Расход обновлён");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const editExpense = async (expense: Expense) => {
    await mutation.mutateAsync(expense);
  };

  return {
    editExpense,
    isPending: mutation.isPending,
  };
};
