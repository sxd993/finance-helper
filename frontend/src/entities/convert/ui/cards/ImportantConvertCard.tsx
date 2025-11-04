import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { Convert } from '../../model/types';

type Props = {
  convert: Convert;
  balance: number;
  limit: number;
  spent: number;
  percentage: number;
};

export const ImportantConvertCard = ({ convert, balance, limit, spent, percentage }: Props) => (
  <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
    <div className='h-full flex flex-col justify-between flex-1'>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-md text-slate-600">{convert.name}</h4>
      </div>
      <div className='flex items-baseline gap-2 justify-start mb-1'>
        <p className='text-black xs:text-2xl text-lg'>{formatPrice(balance)}</p>
        {limit > 0 && (
          <p className='text-sm xs:text-md text-slate-400'>/ {formatPrice(limit)}</p>
        )}
      </div>
    </div>
    <div className='ml-1 flex items-center justify-center'>
      <MiniCircularProgress percentage={percentage} />
    </div>
  </div>
);

