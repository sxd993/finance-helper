import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>,
  error: any
}

export const InvestmentFields = ({ register, error }: Props) => {
  const initital_amount_error = error.initial_amount
  const target_amount_error = error.target_amount

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Покупная стоимость <span className="text-red-500">*</span></label>
        <input
          {...register("initial_amount",
            {
              valueAsNumber: true,
              required: 'Укажите стоимость актива в тот момент, когда вы его купили'
            }
          )}
          type="number"
          min={0}
          placeholder="Покупная стоимость"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
        {initital_amount_error && <p className="text-sm text-red-500">{initital_amount_error.message}</p>}
        <label className="text-sm font-medium text-slate-700">Текущая стоимость <span className="text-red-500">*</span></label>
        <input
          {...register("target_amount",
            {
              valueAsNumber: true,
              required: 'Укажите стоимость актива в данный момент'
            })}
          type="number"
          min={0}
          placeholder="Текущая тоимость"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary"
        />
        {target_amount_error && <p className="text-sm text-red-500">{target_amount_error.message}</p>}
      </div>
    </div>
  )
}
