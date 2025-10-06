import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '@features/auth';


// Хук для выхода
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });
};
