import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  updateProfileApi,
  type UpdateProfileResponse,
} from "../api/updateProfileApi";
import type { ProfileFormValues } from "./types";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateProfileResponse, AxiosError, ProfileFormValues>({
    mutationKey: ["profile", "update"],
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success(data.message || "Профиль обновлён");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Не удалось обновить профиль";
      toast.error(message);
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
