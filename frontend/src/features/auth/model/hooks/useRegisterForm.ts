import { useCallback, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '@features/auth';
import type { RegisterFormData } from '@features/auth'
import {
  isValidRegisterDistribution,
  REGISTER_DISTRIBUTION_DEFAULTS,
  REGISTER_DISTRIBUTION_FIELDS,
  sumRegisterDistribution,
} from '../const/registerDistribution';
import { clearRegisterDraft, readRegisterDraft, writeRegisterDraft } from '../lib/registerDraft';



// Хук для регистрации
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};


export const useRegisterForm = () => {
  const draft = readRegisterDraft();

  const form = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      login: '',
      email: '',
      name: '',
      password: '',
      monthly_income: undefined,
      cycle_type: 'monthly',
      ...REGISTER_DISTRIBUTION_DEFAULTS,
      personalDataConsent: false,
      privacyPolicyAccepted: false,
      ...draft?.values,
    },
  });

  const navigate = useNavigate();
  const registerMutation = useRegister();
  const values = form.watch();
  const distributionTotal = sumRegisterDistribution(values);
  const isDistributionValid = isValidRegisterDistribution(distributionTotal);

  useEffect(() => {
    writeRegisterDraft({ values });
  }, [values]);

  const validateUserInfoStep = useCallback(() => {
    return form.trigger([
      'login',
      'name',
      'email',
      'password',
      'personalDataConsent',
      'privacyPolicyAccepted',
    ]);
  }, [form]);

  const onSubmit = useCallback(async (data: RegisterFormData) => {
    const total = sumRegisterDistribution(data);
    if (!isValidRegisterDistribution(total)) {
      form.setError('root', {
        type: 'validate',
        message: 'Сумма процентов должна равняться 100%',
      });
      return false;
    }

    form.clearErrors('root');

    try {
      await registerMutation.mutateAsync(data);
      clearRegisterDraft();
      navigate('/home');
      return true;
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      return false;
    }
  }, [form, navigate, registerMutation]);

  return {
    register: form.register,
    watch: form.watch,
    handleSubmit: form.handleSubmit,
    validateUserInfoStep,
    distributionFields: REGISTER_DISTRIBUTION_FIELDS,
    distributionTotal,
    isDistributionValid,
    isPending: registerMutation.isPending,
    form_errors: form.formState.errors,
    send_error: isAxiosError(registerMutation.error) ? registerMutation.error.response?.data ?? null : null,
    onSubmit,
  };
};
