import type { ConvertTypeLimitSummary } from "@/entities/convert/model/types"
import type { UseFormRegister } from "react-hook-form"

import { ConvertTypeInfo } from "./ConvertTypeInfo"

interface Props {
  register: UseFormRegister<any>
  convertType?: ConvertTypeLimitSummary
}

export const SavingFields = ({ register, convertType }: Props) => (
  <div className="flex flex-col gap-4 w-full">
    <ConvertTypeInfo convertType={convertType} />

    <div className="flex flex-col gap-2">
      <h2>Сколько вы хотите накопить?</h2>
      <input
        {...register("target_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Введите сумму цели"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
      <h2>Сколько у вас уже накоплено?</h2>
      <input
        {...register("initial_amount", { valueAsNumber: true })}
        type="number"
        min={0}
        placeholder="Введите сумму цели"
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary"
      />
    </div>
  </div>
)
