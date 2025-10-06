import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RegisterFormData } from '@/features/auth/model/types/auth.types';
import { Logo } from '@/shared/ui/Logo';

interface RegisterUserInfoProps {
    register: UseFormRegister<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    isLoading: boolean;
    onNext: () => void;
    onSwitchToLogin: () => void;
}

export const RegisterUserInfo = ({
    register,
    errors,
    isLoading,
    onNext,
    onSwitchToLogin
}: RegisterUserInfoProps) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Logo />
            <form
                className="bg-white px-6 py-8 flex flex-col gap-4 w-full max-w-sm rounded-lg"
                onSubmit={(e) => {
                    e.preventDefault();
                    onNext();
                }}
            >
                <h2 className="text-2xl font-semibold text-gray-600 text-center">Регистрация</h2>


                {/* Логин */}
                <div className="flex flex-col gap-1 w-full">
                    <label>Логин</label>
                    <input
                        type="text"
                        placeholder="Логин"
                        {...register('login', {
                            required: 'Логин обязателен',
                            minLength: { value: 3, message: 'Минимум 3 символа' },
                            pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Только буквы, цифры и _' },
                        })}
                        className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-secondary"
                        disabled={isLoading}
                    />
                    {errors.login && <p className="text-red-500 text-xs">{errors.login.message}</p>}
                </div>

                {/* Имя */}
                <div className="flex flex-col gap-1 w-full">
                    <label>Имя</label>
                    <input
                        type="text"
                        placeholder="Имя"
                        {...register('name', {
                            required: 'Имя обязательно',
                            minLength: { value: 2, message: 'Минимум 2 символа' },
                            maxLength: { value: 50, message: 'Не более 50 символов' },
                        })}
                        className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-secondary"
                        disabled={isLoading}
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1 w-full">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', {
                            required: 'Email обязателен',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Введите корректный email' },
                        })}
                        className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-secondary"
                        disabled={isLoading}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                {/* Пароль */}
                <div className="flex flex-col gap-1 w-full">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Пароль"
                        {...register('password', {
                            required: 'Пароль обязателен',
                            minLength: { value: 6, message: 'Минимум 6 символов' },
                            pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: 'Буквы и цифры обязательны' },
                        })}
                        className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 focus:ring-secondary"
                        disabled={isLoading}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                {/* Кнопка */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 mt-2 rounded-md bg-secondary hover:bg-secondary-dark text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2"
                    disabled={isLoading}
                >
                    Продолжить
                </button>

                <div className="text-center text-s text-gray-500">
                    Уже есть аккаунт?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-primary hover:underline"
                    >
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
};
