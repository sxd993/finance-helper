import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '@features/auth';
import type { RegisterFormData } from '@features/auth'



// Хук для регистрации
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
    },
  });
};


export const useRegisterForm = () => {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      login: '',
      email: '',
      name: '',
      password: '',
      distributionMode: 'baseline',
      cycle_type: 'monthly',
    },
  });

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate('/home');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  }, [navigate, registerMutation]);

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    isPending: registerMutation.isPending,
    form_errors: form.formState.errors,
    send_error: registerMutation.error instanceof Error ? registerMutation.error.response.data  : null,
    onSubmit,
  };
};
