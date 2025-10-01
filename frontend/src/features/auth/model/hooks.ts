import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/AuthApi';

// Хук для получения текущего пользователя
export const useUser = () => {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: AuthApi.checkAuth,
        staleTime: 30 * 60 * 1000, // 30 минут
        retry: false,
    })
    return user
}

// Хук для входа
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data || '');
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

// Простой хук для проверки авторизации
export const useAuth = () => {
  const { data: user, isLoading, error } = useUser();
  
  return {
    user,
    isAuthenticated: !!user && !error,
    isLoading,
    error,
  };
};