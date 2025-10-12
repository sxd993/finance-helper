import React from 'react'
import type { Convert } from '../model/types'
import type { ConvertMetrics } from '@/shared/utils/convertMetrics'
import { ConvertCardWrapper } from './ConvertCardWrapper'
import { ConvertCardContent } from './ConvertCardContent'
import { formatPrice } from '@/shared/utils/formatPrice'
import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress'

export const SavingConvertCard = ({ convert, metrics }: { convert: Convert; metrics: ConvertMetrics }) => {
  const { balance, goal_percentage, remaining_to_goal } = metrics
  const hasTarget = typeof convert.target_amount === 'number' && convert.target_amount > 0
  return (
    <ConvertCardWrapper>
      <ConvertCardContent
        name={convert.name}
        balance={balance}
        additionalInfo={
          hasTarget && (
            <p className='text-slate-600'>
              <span className='text-sm text-slate-500'>Цель: </span>
              <span className='text-base mr-2'>{formatPrice(convert.target_amount)}</span>
              <span className='text-sm text-slate-500'> · Осталось: </span>
              <span className='text-base'>{formatPrice(remaining_to_goal)}</span>
            </p>
          )
        }
      />
      <div className='ml-1 flex items-center justify-center'>
        <MiniCircularProgress percentage={goal_percentage} />
      </div>
    </ConvertCardWrapper>
  )
}

