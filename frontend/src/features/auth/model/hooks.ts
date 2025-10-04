import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/AuthApi';


// Хук для входа
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    },
  });
};

// Хук для регистрации
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data || '');
    },
  });
};

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
