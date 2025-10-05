import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/AuthApi';

export interface LoginFormData {
  login: string;
  password: string;
}


export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
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
