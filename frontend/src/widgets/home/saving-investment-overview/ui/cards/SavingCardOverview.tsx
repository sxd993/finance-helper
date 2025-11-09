import { formatPrice } from "@/shared/utils/formatPrice"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { formatTypeCode } from "@/features/converts/add-convert/model/lib/formatTypeCode"
import type { Convert } from "@/entities/convert/model/types"
import { ProgressBar } from "@/shared/ui/ProgressBar"

interface Props {
  convert: Convert
}

export const SavingCardOverview = ({ convert }: Props) => {

  const name = convert.name
  const typeCode = convert.type_code
  const convertType = formatTypeCode(convert.type_code)
  const current = formatPrice(convert.current_balance)
  const target = formatPrice(convert.target_amount)
  const remainder = formatPrice(convert.target_amount - convert.current_balance)
  const percentage = Math.floor((convert.current_balance / convert.target_amount) * 100);
  

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
          {renderConvertIcon(typeCode)}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{convertType}</p>
          <p className="text-lg font-semibold text-slate-900">{name}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Собрано</p>
          <p className="font-semibold text-slate-900">{current}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1 text-right">Цель</p>
          <p className="font-semibold text-slate-900">{target}</p>
        </div>
      </div>
      <ProgressBar
        color={'bg-green-500'}
        percentage={percentage}
      />
      <div className="flex items-center justify-between text-xs pt-1 gap-2">
        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
          {percentage}%
        </span>
        <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
          Остаток: {remainder}
        </span>
      </div>
    </div>
  )
}
