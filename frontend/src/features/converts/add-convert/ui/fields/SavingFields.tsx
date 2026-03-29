import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>,
  error: any
}

export const SavingFields = ({ register, error }: Props) => {
  const initital_amount_error = error.initial_amount
  const target_amount_error = error.target_amount

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Сколько вы накопили? <span className="text-red-500">*</span></label>
        <input
          {...register("initial_amount",
            {
              valueAsNumber: true,
              required: 'Укажите текущую сумму'
            })}
          type="number"
          min={0}
          placeholder="Введите сумму ваших накоплений"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
        {initital_amount_error && <p className="text-sm text-red-500">{initital_amount_error.message}</p>}
        <label className="text-sm font-medium text-slate-700">Сколько вы хотите накопить? <span className="text-red-500">*</span></label>
        <input
          {...register("target_amount",
            {
              valueAsNumber: true,
              required: 'Укажите конечную сумму цели'
            }
          )}
          type="number"
          min={0}
          placeholder="Введите итоговую сумму цели"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
        {target_amount_error && <p className="text-sm text-red-500">{target_amount_error.message}</p>}
      </div>
    </div>
  )
}
