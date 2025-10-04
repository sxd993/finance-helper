import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useLogin } from './hooks';

export interface LoginFormData {
  login: string;
  password: string;
}

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
