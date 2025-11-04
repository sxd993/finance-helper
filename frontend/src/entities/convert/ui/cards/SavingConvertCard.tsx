import { formatPrice } from '@/shared/utils/formatPrice';
import type { Convert } from '../../model/types';
import { LinearProgress } from '@/shared/ui/LinearProgress';

type Props = {
  convert: Convert;
  balance: number;
  goal_percentage: number;
  remaining_to_goal: number;
};

export const SavingConvertCard = ({ convert, balance, goal_percentage }: Props) => {
  const pct = Math.max(0, Math.min(100, goal_percentage ?? 0));
  const barColor = pct >= 90 ? 'bg-emerald-600' : pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500';
  const chipColor = pct >= 90 ? 'bg-emerald-50 text-emerald-700' : pct >= 60 ? 'bg-emerald-50 text-emerald-700' : pct >= 30 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700';
  const goalReached = pct >= 100;

  return (
    <div className='py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
      захожу сюда и должна быть плашка сколько доступно средств для распределения

      берется из converts_types и можно между разными накоплениями распределять общий пулл денег
      <div className='flex flex-col gap-2'>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg text-gray-900">{convert.name}</h4>
          </div>
        </div>

        {typeof convert.target_amount === 'number' && convert.target_amount > 0 && (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between text-sm text-slate-600'>
              <div className='truncate'>Накоплено: <span className='text-slate-900'>{formatPrice(balance)}</span> / {formatPrice(convert.target_amount)}</div>
              <div className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${chipColor}`}>
                <span className='font-semibold'>{Math.floor(pct)}%</span>
              </div>
            </div>
            <div className='text-xs text-slate-500'>
              {goalReached && <span className='ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5'>Цель достигнута</span>}
            </div>
            <LinearProgress
              value={pct}
              className='h-2 w-full bg-slate-100'
              barClassName={`${barColor}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
