import React from 'react'
import { formatPrice } from '@/shared/utils/formatPrice'

export const ConvertCardContent = ({ name, balance, additionalInfo, className = '' }: { name: string; balance: number; additionalInfo?: React.ReactNode; className?: string }) => (
  <div className={`h-full flex flex-col justify-between flex-1 ${className}`}>
    <div className="flex items-center gap-2 mb-1">
      <h4 className="text-md text-slate-600">{name}</h4>
    </div>
    <div className='flex items-baseline gap-2 justify-start mb-1'>
      <p className='text-black text-3xl'>{formatPrice(balance)}</p>
    </div>
    {additionalInfo}
  </div>
)

