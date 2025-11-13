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
        <h2>Покупная стоимость
          <span className="text-red-500">*</span>
        </h2>
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
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
        {initital_amount_error && <p className="text-red-500">{initital_amount_error.message}</p>}
        <h2>Текущая стоимость
          <span className="text-red-500">*</span>
        </h2>
        <input
          {...register("target_amount",
            {
              valueAsNumber: true,
              required: 'Укажите стоимость актива в данный момент'
            })}
          type="number"
          min={0}
          placeholder="Текущая тоимость"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
        {target_amount_error && <p className="text-red-500">{target_amount_error.message}</p>}
      </div>
    </div>
  )
}