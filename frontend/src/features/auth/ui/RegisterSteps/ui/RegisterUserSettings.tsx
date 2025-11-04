import type {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import type { RegisterFormData } from '@/features/auth/model/types/auth.types';

interface RegisterUserSettingsProps {
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  watch: UseFormWatch<RegisterFormData>;
  error: Error | null;
}

export const RegisterUserSettings = ({
  register,
  handleSubmit,
  onSubmit,
  onBack,
  isLoading,
  watch,
  error,
}: RegisterUserSettingsProps) => {
  const distributionMode = watch('distributionMode');
  const shouldShowIncome = distributionMode === 'baseline';


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 flex flex-col gap-6 w-full max-w-md rounded-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Ваши настройки</h2>
        <p className="text-gray-500 mt-1">
          Укажите параметры для финансового планирования
        </p>
      </div>


      {/* Тип цикла */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Время сброса конвертов
        </label>
        <input type="hidden" value="monthly" {...register('cycle_type', { required: true })} />
        <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600">
          Конверты автоматически обновляются раз в месяц.
        </div>
      </div>

      {/* Режим */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Режим пополнения
        </label>
        <select
          {...register('distributionMode', { required: 'Выберите режим' })}
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
        >
          <option value="baseline">Укажу фиксированную сумму</option>
          <option value="flex">Самостоятельно</option>
        </select>
      </div>

      {/* Доход */}
      {shouldShowIncome && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ежемесячный доход
          </label>
          <input
            type="number"
            placeholder="Введите сумму"
            {...register('monthly_income', {
              valueAsNumber: true,
              required: 'Доход обязателен',
              min: { value: 0, message: 'Доход не может быть отрицательным' },
            })}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
          />
        </div>
      )}

      {/* Ошибка формы */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-red-600 text-xs text-center">{error.message}</p>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-50 transition"
        >
          Назад
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary text-white rounded-md py-2 hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
        </button>
      </div>
    </form>
  );
};
