import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '@features/auth';


export const useLogout = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });
  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
  }
  return { handleLogout }
};
