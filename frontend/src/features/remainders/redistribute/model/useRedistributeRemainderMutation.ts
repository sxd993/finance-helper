import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import {
  RedistributeRemainder,
  type RedistributeRemainderRequest,
} from "../api/RedistributeRemainder";

interface ErrorResponse {
  message?: string;
}

export const useRedistributeRemainderMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["redistribute-remainder"],
    mutationFn: RedistributeRemainder,
    onSuccess: () => {
      toast.success("Остаток перераспределён");
      queryClient.invalidateQueries({ queryKey: ["remainders"] });
      queryClient.invalidateQueries({ queryKey: ["remainders-history"] });
      queryClient.invalidateQueries({ queryKey: ["converts"] });
      queryClient.invalidateQueries({ queryKey: ["limits"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message ?? "Не удалось распределить остаток");
    },
  });

  const redistribute = async (payload: RedistributeRemainderRequest) => {
    await mutation.mutateAsync(payload);
  };

  return {
    redistribute,
    isPending: mutation.isPending,
  };
};
