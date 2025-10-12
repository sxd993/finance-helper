import React from 'react'
import type { Convert } from '../model/types'
import type { ConvertMetrics } from '@/shared/utils/convertMetrics'
import { ConvertCardWrapper } from './ConvertCardWrapper'
import { ConvertCardContent } from './ConvertCardContent'
import { formatPrice } from '@/shared/utils/formatPrice'
import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress'

export const LimitedConvertCard = ({ convert, metrics }: { convert: Convert; metrics: ConvertMetrics }) => {
  const { balance, limit, spent, percentage } = metrics
  return (
    <ConvertCardWrapper>
      <ConvertCardContent
        name={convert.name}
        balance={balance}
        additionalInfo={
          <>
            {limit > 0 && (
              <>
                <p className='text-xl text-slate-400 -mt-1'>/ {formatPrice(limit)}</p>
                <p className='text-slate-600'>
                  <span className='text-sm text-slate-500'>Потрачено: </span>
                  <span className='text-base'>{formatPrice(spent)}</span>
                </p>
              </>
            )}
          </>
        }
      />
      <div className='ml-1 flex items-center justify-center'>
        <MiniCircularProgress percentage={percentage} />
      </div>
    </ConvertCardWrapper>
  )
}

