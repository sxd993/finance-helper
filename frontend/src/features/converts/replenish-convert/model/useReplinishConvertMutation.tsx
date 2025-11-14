import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { ReplenishConvert } from "../api/ReplenishConvert";
import type { ReplenishConvertRequest } from "../api/ReplenishConvert";

interface ErrorResponse {
  message?: string;
}

export const useReplinishConvertMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["replenish-convert"],
    mutationFn: ReplenishConvert,
    onSuccess: () => {
      toast.success("Конверт пополнен");
      queryClient.invalidateQueries();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message ?? "Не удалось пополнить конверт";
      toast.error(message);
    },
  });

  const replenishConvert = async (payload: ReplenishConvertRequest) => {
    await mutation.mutateAsync(payload);
  };

  return {
    replenishConvert,
    isPending: mutation.isPending,
  };
};
