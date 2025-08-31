// src/components/Register.tsx
import { useForm } from 'react-hook-form';

interface RegisterFormData {
  login: string;
  name: string;
  password: string;
}

interface RegisterProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  error: Error | null;
  onSwitchToLogin: () => void;
}

export const Register = ({ onSubmit, isLoading, error, onSwitchToLogin }: RegisterProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      login: '',
      name: '',
      password: '',
    }
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-10">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-orange-500">Finance</span> Helper
        </h1>
      </div>

      <form
        className="bg-white px-6 py-8 flex flex-col gap-4 w-full max-w-sm rounded-lg shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
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
            className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.login
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
            className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.name
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
            className={`w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.password
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

        {/* Кнопка регистрации */}
        <button
          type="submit"
          className="w-full px-4 py-2 mt-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
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
    </div>
  );
};
