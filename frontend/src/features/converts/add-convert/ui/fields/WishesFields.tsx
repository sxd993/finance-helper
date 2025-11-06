import type { UseFormRegister } from "react-hook-form"

interface Props {
  register: UseFormRegister<any>
}

export const WishesFields = ({ register }: Props) => (
  <div className="flex flex-col gap-4 w-full">
    <div className="flex flex-col gap-2">
      <h2>Месячный лимит</h2>
      <input
        {...register("target_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Лимит на месяц"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
    </div>
  </div>
)
