import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>
}

export const InvestmentFields = ({ register }: Props) => (
  <div className="flex flex-col gap-4 w-full">

    <div className="flex flex-col gap-2">
      <h2>Стартовая сумма (вложено)</h2>
      <input
        {...register("initial_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Вложено"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
      <h2>Текущая рыночная стоимость</h2>
      <input
        {...register("current_value", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Текущая стоимость"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
    </div>
  </div>
)
