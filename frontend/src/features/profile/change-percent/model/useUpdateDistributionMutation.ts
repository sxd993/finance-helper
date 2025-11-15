import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { updateDistributionApi } from "../api/updateDistributionApi";
import type {
  ChangePercentApiPayload,
  ChangePercentResponse,
} from "./types";

export const useUpdateDistributionMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ChangePercentResponse,
    AxiosError,
    ChangePercentApiPayload
  >({
    mutationKey: ["profile", "distribution"],
    mutationFn: updateDistributionApi,
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
      toast.success("Схема распределения обновлена");
    },
    onError: () => {
      toast.error("Не удалось обновить схему распределения");
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
