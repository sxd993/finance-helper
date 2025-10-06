import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import type { RegisterFormData } from '@/features/auth/model/useRegisterForm';

interface StepAuthUserSettingsProps {
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  watch: UseFormWatch<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  error: Error | null;
}

export const StepAuthUserSettings = ({
  register,
  handleSubmit,
  onSubmit,
  onBack,
  isLoading,
  watch,
  error,
}: StepAuthUserSettingsProps) => {
  const distributionMode = watch('distributionMode');
  const shouldShowIncome = distributionMode === 'baseline';
  const monthlyIncome = watch('monthly_income');

  const isSubmitDisabled =
    isLoading || (shouldShowIncome && (monthlyIncome === undefined || monthlyIncome === null || monthlyIncome === ''));

  const previousStepErrors = (['login', 'name', 'email', 'password'] as const)
    .map((field) => errors[field]?.message)
    .filter((message): message is string => typeof message === 'string' && message.trim().length > 0);


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

      {previousStepErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm font-semibold mb-1">
            Проверьте данные с первого шага:
          </p>
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
            {previousStepErrors.map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        </div>
      )}


      {/* Тип цикла */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Время сброса конвертов
        </label>
        <select
          {...register('cycle_type', { required: 'Выберите период' })}
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
        >
          <option value="weekly">Еженедельно</option>
          <option value="monthly">Ежемесячно</option>
        </select>
        {errors.cycle_type && (
          <p className="text-red-500 text-xs mt-1">{errors.cycle_type.message}</p>
        )}
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
        {errors.distributionMode && (
          <p className="text-red-500 text-xs mt-1">{errors.distributionMode.message}</p>
        )}
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
          {errors.monthly_income && (
            <p className="text-red-500 text-xs mt-1">{errors.monthly_income.message}</p>
          )}
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
          disabled={isSubmitDisabled}
          className="flex-1 bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 disabled:opacity-50 transition"
        >
          {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
        </button>
      </div>
    </form>
  );
};
