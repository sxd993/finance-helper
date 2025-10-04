import type { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';
import type { RegisterFormData } from '../../model/useRegisterForm';

interface StepAuthUserSettingsProps {
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  hasIncome: boolean;
}

export const StepAuthUserSettings = ({
  register,
  handleSubmit,
  onSubmit,
  onBack,
  isLoading,
  hasIncome
}: StepAuthUserSettingsProps) => {
  return (
    <div className="bg-white px-6 py-8 flex flex-col gap-6 w-full max-w-md rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-600">Ваши настройки</h2>
        <p className="text-gray-500 mt-2">Укажите параметры для финансового планирования</p>
      </div>

      {/* Доход */}
      <div>
        <h2>Ежемесячный доход</h2>
        <input
          type="number"
          placeholder="Ежемесячный доход"
          {...register('monthly_income', {
            required: 'Доход обязателен',
            min: { value: 0, message: 'Доход не может быть отрицательным' }
          })}
          className="w-full px-4 py-2 border rounded-md"
          disabled={isLoading}
        />
      </div>

      {/* Тип цикла */}
      <div>
        <h2>Время сброса конвертов</h2>
        <select
          {...register('cycle_type', { required: true })}
          className="w-full px-4 py-2 border rounded-md"
          disabled={isLoading}
        >
          <option value="weekly">Еженедельно</option>
          <option value="monthly">Ежемесячно</option>
        </select>
      </div>

      {/* Режим */}
      <div>
        <h2>Режим пополнения</h2>
        <select
          {...register('distributionMode', { required: true })}
          className="w-full px-4 py-2 border rounded-md"
          disabled={isLoading}
        >
          <option value="baseline">1 раз в месяц</option>
          <option value="flex">Самостоятельно</option>
        </select>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-gray-600"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!hasIncome || isLoading}
          className="flex-1 px-4 py-2 rounded-md bg-orange-500 text-white disabled:opacity-50"
        >
          {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
        </button>
      </div>
    </div>
  );
};
