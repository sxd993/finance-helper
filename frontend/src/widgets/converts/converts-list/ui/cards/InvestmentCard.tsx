import { formatPrice } from "@/shared/utils/formatPrice"
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon"
import { formatTypeCode } from "@/entities/convert"
import type { Convert } from "@/entities/convert/model/types"

interface Props {
  convert: Convert
}

export const InvestmentCard = ({ convert }: Props) => {
  const title = convert.name
  const convertType = formatTypeCode(convert.type_code)
  const currentAmount = formatPrice(convert.current_balance)
  const targetAmount = formatPrice(convert.target_amount)
  const percentage = convert.target_amount
    ? Math.min(999, Math.max(0, Math.round((convert.current_balance / convert.target_amount) * 100)))
    : 0
  const absoluteReturnValue = convert.current_balance - convert.target_amount
  const absoluteReturn = formatPrice(absoluteReturnValue)
  const isProfit = absoluteReturnValue > 0
  const isLoss = absoluteReturnValue < 0
  const colorClass = isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600';

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
          <p className="font-semibold text-slate-900">{currentAmount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Текущая сумма</p>
          <p className="font-semibold text-emerald-600">{targetAmount}</p>
          <div className='flex justify-center'>
            <span className={colorClass}>{absoluteReturn}</span>
            <span className='text-slate-300 px-1'>•</span>
            <span className={colorClass}>{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
