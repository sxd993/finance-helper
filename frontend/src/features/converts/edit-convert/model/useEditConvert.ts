import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { EditConvert } from "../api/EditConvert";
import type { EditConvertPayload } from "./types";

interface ErrorResponse {
  message?: string;
}

export const useEditConvert = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["edit-convert"],
    mutationFn: EditConvert,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Конверт обновлен");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message ?? "Не удалось обновить конверт";
      toast.error(message);
    },
  });

  const editConvert = async (payload: EditConvertPayload) => {
    await mutation.mutateAsync(payload);
  };

  return {
    editConvert,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
