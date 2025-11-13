import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>,
  error: any
}

export const ImportantFields = ({ register, error }: Props) => {
  const target_amount_error = error.target_amount

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <h2>Месячный лимит
          <span className="text-red-500">*</span>
        </h2>
        <input
          {...register("target_amount", { valueAsNumber: true, required: 'Укажите месячный лимит' })}
          type="number"
          min={0}
          placeholder="Лимит на месяц"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
        />
        {target_amount_error && <p className="text-red-500">{target_amount_error.message}</p>}
      </div>
    </div>
  )
}

