import React, { useState } from 'react'
import type { Convert } from '../model/types'
import type { ConvertMetrics } from '@/shared/utils/convertMetrics'
import { ConvertCardWrapper } from './ConvertCardWrapper'
import { ConvertCardContent } from './ConvertCardContent'
import { formatPrice } from '@/shared/utils/formatPrice'
import { TrendingUp, TrendingDown, Minus, Edit3 } from 'lucide-react'
import { Modal } from '@/shared/ui/Modal'
import { UpdateInvestementsForm } from '@/features/update-convert-investements/ui/UpdateInvestementsForm'

export const InvestmentConvertCard = ({ convert, metrics }: { convert: Convert; metrics: ConvertMetrics }) => {
  const { balance, returnPercentage, absoluteReturn, isProfit, isLoss } = metrics
  const [isInvestOpen, setInvestOpen] = useState(false)
  const profitColor = isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600'
  const TrendIcon = isProfit ? TrendingUp : isLoss ? TrendingDown : Minus
  const iconColor = isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-500'
  return (
    <>
      <ConvertCardWrapper>
        <ConvertCardContent
          name={convert.name}
          balance={convert.current_value ?? balance}
          additionalInfo={
            <>
              <div className='text-xs text-slate-600'>
                <span className='text-slate-500'>Вложено: </span>
                <span className='font-medium'>{formatPrice(convert.initial_investment ?? 0)}</span>
                <span className='mx-2 text-slate-400'>·</span>
                <span className='text-slate-500'>Доходность: </span>
                <span className={`font-medium ${profitColor}`}>{returnPercentage.toFixed(2)}%</span>
                <span className='mx-2 text-slate-400'>·</span>
                <span className='text-slate-500'>P/L: </span>
                <span className={`font-medium ${profitColor}`}>{formatPrice(absoluteReturn)}</span>
              </div>
              {convert.last_updated && (
                <div className='mt-1 text-[10px] text-slate-400'>
                  Обновлено: {new Date(convert.last_updated).toLocaleString('ru-RU')}
                </div>
              )}
            </>
          }
        />
        <div className='ml-1 flex items-center justify-center gap-3'>
          <div className='flex items-center gap-2'>
            <TrendIcon className={`w-4 h-4 ${iconColor}`} />
            <span className={`text-sm font-semibold ${profitColor}`}>{returnPercentage.toFixed(2)}%</span>
          </div>
          <button
            className='inline-flex items-center gap-1 h-8 px-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50'
            onClick={() => setInvestOpen(true)}
          >
            <Edit3 className='w-4 h-4' />
            <span className='text-xs font-medium'>Обновить</span>
          </button>
        </div>
      </ConvertCardWrapper>

      <Modal
        isOpen={isInvestOpen}
        onClose={() => setInvestOpen(false)}
        title={
          <div className='flex items-center gap-2 justify-center'>
            <Edit3 className='w-4 h-4 text-slate-700' />
            <span>Обновить инвестицию</span>
          </div>
        }
      >
        <UpdateInvestementsForm
          convertId={convert.id}
          initial_investment={convert.initial_investment ?? null}
          current_value={convert.current_value ?? null}
          onClose={() => setInvestOpen(false)}
        />
      </Modal>
    </>
  )
}

