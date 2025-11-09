import { formatPrice } from "@/shared/utils/formatPrice"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { formatTypeCode } from "@/features/converts/add-convert/model/lib/formatTypeCode"
import type { Convert } from "@/entities/convert/model/types"

interface Props {
  convert: Convert
}

export const InvestmentCardOverview = ({ convert }: Props) => {
  const title = convert.name
  const convertType = formatTypeCode(convert.type_code)
  const initialAmount = formatPrice(convert.initial_amount)
  const currentAmount = formatPrice(convert.current_balance)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
          {renderConvertIcon(convert.type_code)}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{convertType}</p>
          <p className="text-lg font-semibold text-slate-900">{title}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Начальная сумма</p>
          <p className="font-semibold text-slate-900">{initialAmount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Текущая сумма</p>
          <p className="font-semibold text-emerald-600">{currentAmount}</p>
        </div>
      </div>
    </div>
  )
}
