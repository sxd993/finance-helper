import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Logo } from '@shared/ui/Logo';

interface RegisterFormData {
  login: string;
  name: string;
  email: string;
  password: string;
  monthly_income: number;
}

interface RegisterProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  error: Error | null;
  onSwitchToLogin: () => void;
}

type FormStep = 'credentials' | 'income';

export const Register = ({ onSubmit, isLoading, error, onSwitchToLogin }: RegisterProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('credentials');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      login: '',
      email: '',
      monthly_income: 0,
      name: '',
      password: '',
    }
  });

  const formData = watch();

  const handleNextStep = () => {
    setCurrentStep('income');
  };

  const handleBackStep = () => {
    setCurrentStep('credentials');
  };


  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-10 py-8">
      <Logo />
      {currentStep === 'credentials' ? (
        <form
          className="bg-white px-6 py-8 flex flex-col gap-4 w-full max-w-sm rounded-lg shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep();
          }}
        >
          <h2 className="text-2xl font-bold text-gray-600 text-center">
            Регистрация
          </h2>

          {/* Ошибка от сервера */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 w-full">
              <p className="text-red-600 text-xs text-center leading-tight">
                {error instanceof Error ? error.message : 'Произошла ошибка'}
              </p>
            </div>
          )}

          {/* Поле логина */}
          <div className="flex flex-col gap-1 w-full">
            <input
              type="text"
              placeholder="Логин"
              {...register('login', {
                required: 'Логин обязателен',
                minLength: {
                  value: 3,
                  message: 'Логин должен быть не менее 3 символов',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Логин может содержать только буквы, цифры и подчеркивания',
                },
              })}
              className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${errors.login
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-300'
                  : 'border-gray-200 focus:ring-orange-400 focus:border-transparent'
                }`}
              disabled={isLoading}
            />
            <div className="h-4">
              {errors.login && (
                <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                  {errors.login.message}
                </p>
              )}
            </div>
          </div>

          {/* Поле имени */}
          <div className="flex flex-col gap-1 w-full">
            <input
              type="text"
              placeholder="Имя"
              {...register('name', {
                required: 'Имя обязательно',
                minLength: {
                  value: 2,
                  message: 'Имя должно быть не менее 2 символов',
                },
                maxLength: {
                  value: 50,
                  message: 'Имя не должно превышать 50 символов',
                }
              })}
              className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-300'
                  : 'border-gray-200 focus:ring-orange-400 focus:border-transparent'
                }`}
              disabled={isLoading}
            />
            <div className="h-4">
              {errors.name && (
                <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Поле email */}
          <div className="flex flex-col gap-1 w-full">
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Введите корректный email',
                }
              })}
              className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-300'
                  : 'border-gray-200 focus:ring-orange-400 focus:border-transparent'
                }`}
              disabled={isLoading}
            />
            <div className="h-4">
              {errors.email && (
                <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Поле пароля */}
          <div className="flex flex-col gap-1 w-full">
            <input
              type="password"
              placeholder="Пароль"
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Пароль должен быть не менее 6 символов',
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                  message: 'Пароль должен содержать буквы и цифры',
                }
              })}
              className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-300'
                  : 'border-gray-200 focus:ring-orange-400 focus:border-transparent'
                }`}
              disabled={isLoading}
            />
            <div className="h-4">
              {errors.password && (
                <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Кнопка продолжения */}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            disabled={isLoading}
          >
            Продолжить
          </button>

          {/* Ссылка на логин */}
          <div className="text-center text-sm text-gray-500">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-orange-500 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded"
            >
              Войти
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white px-6 py-8 flex flex-col gap-6 w-full max-w-md rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600">
              Выберите ваш доход
            </h2>
            <p className="text-gray-500 mt-2">
              Это поможет нам точнее понять как следить за вашими финансами
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input
              type="number"
              placeholder="Введите ваш ежемесячный доход"
              {...register('monthly_income', {
                required: 'Доход обязателен',
                min: {
                  value: 0,
                  message: 'Доход не может быть отрицательным',
                },
              })}
              className={"w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200"}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBackStep}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!formData.monthly_income || isLoading}
              className="flex-1 px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};