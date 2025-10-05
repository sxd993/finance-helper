import { useLoginForm } from "@features/auth";

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login = ({ onSwitchToRegister }: LoginProps) => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
    onSubmit,
  } = useLoginForm();

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <form
          className="bg-white px-6 py-8 flex flex-col items-center gap-4 w-full max-w-sm rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl text-gray-600 text-center font-semibold">
            Авторизация
          </h2>

          {/* Ошибка от сервера */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 w-full">
              <p className="text-red-600 text-xs text-center leading-tight">
                {error.message || 'Произошла ошибка'}
              </p>
            </div>
          )}

          {/* Поле логина */}
          <div className="flex flex-col gap-1 w-full">
            <h2>Логин</h2>
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
              className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 focus:text-secondary"
              disabled={isLoading}
            />
            {errors.login && (
              <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                {errors.login.message}
              </p>
            )}
          </div>

          {/* Поле пароля */}
          <div className="flex flex-col gap-2 w-full">
            <h2>Пароль</h2>
            <input
              type="password"
              placeholder="Пароль"
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Пароль должен быть не менее 6 символов',
                },
              })}
              className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 focus:text-secondary"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs animate-in slide-in-from-top-1 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-2 rounded-md bg-secondary hover:bg-secondary-dark text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>

          {/* Ссылка на регистрацию */}
          <div className="text-center text-s text-gray-500">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
