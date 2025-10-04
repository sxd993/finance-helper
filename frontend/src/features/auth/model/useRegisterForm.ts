import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useRegister } from './hooks';

export type RegisterStep = 'userInfo' | 'userSettings';

export interface RegisterFormData {
  login: string;
  name: string;
  email: string;
  password: string;
  distributionMode: 'baseline' | 'flex';
  monthly_income: number;
  cycle_type: 'monthly' | 'weekly';
}

export const useRegisterForm = () => {
  const [step, setStep] = useState<RegisterStep>('userInfo');
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

  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate('/home');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  }, [navigate, registerMutation]);

  return {
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
