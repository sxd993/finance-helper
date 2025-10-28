import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>
}

export const WishesFields = ({ register }: Props) => (
  <div className="flex flex-col gap-4 w-full">

    <div className="flex flex-col gap-2">
      <h2>Месячный лимит (опционально)</h2>
      <input
        {...register("target_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Лимит на месяц"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
      <h2>Начальная сумма (опционально)</h2>
      <input
        {...register("initial_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Текущая сумма"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
    </div>
  </div>
)
