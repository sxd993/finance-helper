import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { Convert } from '../../model/types';

type Props = {
  convert: Convert;
  balance: number;
  goal_percentage: number;
  remaining_to_goal: number;
};

export const SavingConvertCard = ({ convert, balance, goal_percentage, remaining_to_goal }: Props) => (
  <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
    <div className='h-full flex flex-col justify-between flex-1'>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-md text-slate-600">{convert.name}</h4>
      </div>
      <div className='flex items-baseline gap-2 justify-start mb-1'>
        <p className='text-black text-3xl'>{formatPrice(balance)}</p>
      </div>
      {typeof convert.target_amount === 'number' && convert.target_amount > 0 && (
        <p className='text-slate-600'>
          <span className='text-sm text-slate-500'>Цель: </span>
          <span className='text-base mr-2'>{formatPrice(convert.target_amount)}</span>
          <span className='text-sm text-slate-500'> · Осталось: </span>
          <span className='text-base'>{formatPrice(remaining_to_goal)}</span>
        </p>
      )}
    </div>
    <div className='ml-1 flex items-center justify-center'>
      <MiniCircularProgress percentage={goal_percentage} />
    </div>
  </div>
);

