import type { ConvertTypeLimitSummary } from "@/entities/convert/model/types"
import type { UseFormRegister } from "react-hook-form"

import { ConvertTypeInfo } from "./ConvertTypeInfo"

interface Props {
  register: UseFormRegister<any>
  convertType?: ConvertTypeLimitSummary
}

export const InvestmentFields = ({ register, convertType }: Props) => (
  <div className="flex flex-col gap-4 w-full">
    <ConvertTypeInfo convertType={convertType} />

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
