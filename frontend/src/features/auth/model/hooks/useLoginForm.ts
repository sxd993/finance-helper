import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '@features/auth';
import type { LoginFormData } from '@features/auth';
import type { User } from '@/entities/user';



export const useLogin = () => {
  const queryClient = useQueryClient();


  return useMutation<User, Error, LoginFormData>({
    mutationFn: AuthApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};


export const useLoginForm = () => {
  const form = useForm<LoginFormData>({
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate('/home');
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  }, [loginMutation, navigate]);

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    isLoading: loginMutation.isPending,
    error: loginMutation.error instanceof Error ? loginMutation.error : null,
    onSubmit,
  };
};
