import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/AuthApi';
import { useRegisterStore } from '@widgets/register/model/registerStore';

export interface RegisterFormData {
  login: string;
  name: string;
  email: string;
  password: string;
  distributionMode: 'baseline' | 'flex';
  monthly_income: number;
  cycle_type: 'monthly' | 'weekly';
}

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

export const useRegisterForm = () => {
  const { step, setStep, reset } = useRegisterStore();
  const form = useForm<RegisterFormData>({
    defaultValues: {
      login: '',
      email: '',
      name: '',
      password: '',
      distributionMode: 'baseline',
      cycle_type: 'weekly',
    },
  });

  const navigate = useNavigate();
  const registerMutation = useRegister();

  useEffect(() => reset, [reset]);

  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate('/home');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  }, [navigate, registerMutation]);

  return {
    form,
    step,
    setStep,
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    watch: form.watch,
    isLoading: registerMutation.isPending,
    error: registerMutation.error instanceof Error ? registerMutation.error : null,
    onSubmit,
  };
};
