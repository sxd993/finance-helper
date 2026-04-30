import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from 'react-hook-form';
import { getConvertTypePalette } from '@/entities/convert';
import type { RegisterFormData } from '@/features/auth/model/types/auth.types';
import type { RegisterDistributionField } from '@/features/auth/model/const/registerDistribution';
import { formatPrice } from '@/shared/utils/formatPrice';

interface RegisterUserSettingsProps {
  register: UseFormRegister<RegisterFormData>;
  watch: UseFormWatch<RegisterFormData>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  distributionFields: RegisterDistributionField[];
  distributionTotal: number;
  isDistributionValid: boolean;
  onBack: () => void;
  isLoading: boolean;
  errors: FieldErrors<RegisterFormData>;
  error: { message?: string } | null;
}

export const RegisterUserSettings = ({
  register,
  watch,
  handleSubmit,
  onSubmit,
  distributionFields,
  distributionTotal,
  isDistributionValid,
  onBack,
  isLoading,
  errors,
  error,
}: RegisterUserSettingsProps) => {
  const total = Number(distributionTotal || 0);
  const formattedTotal = Number.isInteger(total) ? total.toFixed(0) : total.toFixed(1);
  const values = watch();
  const monthlyIncome = Number(values.monthly_income || 0);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 flex flex-col gap-6 w-full max-w-xl rounded-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Ваши настройки</h2>
        <p className="text-gray-500 mt-1">
          Укажите параметры для финансового планирования
        </p>
      </div>


      {/* Доход */}
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
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
        />
        {errors.monthly_income && (
          <p className="mt-1 text-xs text-red-500">{errors.monthly_income.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Распределение дохода</h3>
          <p className="mt-1 text-sm text-slate-500">
            Укажите, какая доля ежемесячного дохода пойдёт в каждую категорию.
          </p>
        </div>

        <div className="space-y-4">
          {distributionFields.map((field) => {
            const palette = getConvertTypePalette(field.typeCode);
            const fieldError = errors[field.name];
            const percent = Number(values[field.name] || 0);
            const amount = (monthlyIncome * percent) / 100;

            return (
              <div key={field.name} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${palette.bg}`} />
                      <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{field.description}</p>
                    <p className="text-base font-medium text-green-600 mt-1">
                      {formatPrice(amount) ?? '0 ₽'}
                    </p>
                  </div>
                  <div className="flex w-24 shrink-0 items-center gap-1 rounded-2xl border border-slate-200 px-3 py-2 ring-inset focus-within:border-primary">
                    <input
                      type="number"
                      step="1"
                      disabled={isLoading}
                      {...register(field.name, {
                        valueAsNumber: true,
                        required: 'Укажите процент',
                        min: {
                          value: 0,
                          message: 'Минимум 0%',
                        },
                        max: {
                          value: 100,
                          message: 'Максимум 100%',
                        },
                      })}
                      className="w-full border-none bg-transparent text-right text-sm font-semibold text-slate-900 outline-none disabled:bg-transparent"
                    />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                </div>
                {fieldError?.message && (
                  <p className="text-xs text-red-500">{fieldError.message}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-1 py-2 text-sm">
          <span className="text-slate-600">Суммарное распределение</span>
          <span className={`text-base font-semibold ${isDistributionValid ? 'text-emerald-600' : 'text-red-500'}`}>
            {formattedTotal}%
          </span>
        </div>
        {!isDistributionValid && (
          <p className="text-xs text-red-500 text-right">Сумма процентов должна равняться 100%</p>
        )}
        {errors.root?.message && (
          <p className="text-xs text-red-500 text-right">{errors.root.message}</p>
        )}
      </div>

      {/* Ошибка формы */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-red-600 text-xs text-center">{error.message ?? 'Не удалось завершить регистрацию'}</p>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-3">
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
          disabled={isLoading || !isDistributionValid}
          className="flex-1 bg-primary text-white rounded-md py-2 hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
        </button>
      </div>
    </form>
  );
};
