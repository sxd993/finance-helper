import { Button } from '@/shared/ui/Button'
import { useAddConvertForm } from '../model/hooks/useAddConvertForm'

export const AddConvertsForm = () => {
  const {
    register,
    onSubmit,
    type,
    convert_types,
    isPending,
    canSubmit,
    errorMessage,
  } = useAddConvertForm()

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white px-6 py-8 flex flex-col items-center gap-4 rounded-lg w-full border border-slate-200 shadow-lg"
    >
      {/* Название */}
      <div className="flex flex-col gap-2 w-full">
        <h2>Название конверта</h2>
        <input
          {...register('name', { required: true })}
          type="text"
          placeholder="Название конверта"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
      </div>

      {/* Тип */}
      <div className="flex flex-col gap-2 w-full">
        <h2>Тип конверта</h2>
        <select
          {...register('type_code', { required: true })}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        >
          <option value="">Выберите тип...</option>
          {convert_types?.map((convert) => (
            <option key={convert.id} value={convert.code}>
              {convert.title}
            </option>
          ))}
        </select>
      </div>

      {/* Поля по типу */}
      {type === 'saving' && (
        <div className="flex flex-col gap-2 w-full">
          <h2>Сколько вы хотите накопить?</h2>
          <input
            {...register('target_amount', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="Введите сумму цели"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
          />
          <h2>Сколько у вас уже накоплено?</h2>
          <input
            {...register('current_amount', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="Введите сумму цели"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
          />
        </div>
      )}

      {type === 'investment' && (
        <div className="flex flex-col gap-2 w-full">
          <h2>Сколько сейчас денег инвестировано?</h2>
          <input
            {...register('current_amount', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="Текущая сумма"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
          />
        </div>
      )}

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className="mt-4 px-6 py-2 rounded-xl transition-all
                   bg-secondary text-white hover:bg-secondary/90
                   disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-slate-300"
      >
        {isPending ? 'Создание...' : 'Создать конверт'}
      </button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  )
}
