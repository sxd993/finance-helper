import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from 'react-hook-form';
import { getConvertTypePalette } from '@/entities/convert';
import type { RegisterFormData } from '@/features/auth/model/types/auth.types';
import type { RegisterDistributionField } from '@/features/auth/model/const/registerDistribution';
import { ProgressBar } from '@/shared/ui/ProgressBar';

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
  const formattedTotal = Number(distributionTotal || 0).toFixed(1);
  const values = watch();

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

        <div className="grid gap-3 sm:grid-cols-2">
          {distributionFields.map((field) => {
            const palette = getConvertTypePalette(field.typeCode);
            const fieldError = errors[field.name];
            const value = Math.max(0, Math.min(100, Number(values[field.name] || 0)));

            return (
              <div
                key={field.name}
                className={`rounded-3xl border ${palette.border} ${palette.softBg} p-4 shadow-sm`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${palette.bg}`} />
                      <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{field.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
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
                      className="w-20 rounded-2xl border border-white/70 bg-white px-3 py-2 text-right text-sm font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100"
                    />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/70 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className={palette.text}>Доля</span>
                    <span className="font-semibold text-slate-700">
                      {value}%
                    </span>
                  </div>
                  <ProgressBar color={palette.bg} percentage={value} />
                </div>
                {fieldError?.message && (
                  <p className="mt-2 text-xs text-red-500">{fieldError.message}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-600">Суммарное распределение</span>
          <span className={`font-semibold ${isDistributionValid ? 'text-emerald-600' : 'text-red-500'}`}>
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
          disabled={isLoading || !isDistributionValid}
          className="flex-1 bg-primary text-white rounded-md py-2 hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {isLoading ? 'Создаем аккаунт...' : 'Завершить регистрацию'}
        </button>
      </div>
    </form>
  );
};
