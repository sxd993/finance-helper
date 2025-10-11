import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress';
import type { Convert } from '../model/types';
import { formatPrice } from '@/shared/utils/formatPrice';
//

type ConvertCardProps = {
  convert: Convert;
};


export const ConvertCard = ({ convert }: ConvertCardProps) => {
  const balance = typeof convert.current_amount === 'number' ? convert.current_amount : 0;
  const limit = typeof convert.overall_limit === 'number' ? convert.overall_limit : 0;
  const spent = limit - balance
  const percentage = limit > 0
    ? Math.min(100, Math.max(0, (balance / limit) * 100))
    : 100;

  switch (convert.type_id.code) {
    case 'important':
      return (
        <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm'>

          {/* Левая часть */}
          <div className='h-full flex flex-col justify-between flex-1'>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-md text-slate-600">{convert.name}</h4>
            </div>
            <div className='flex items-baseline gap-2 justify-start mb-1'>
              <p className='text-black text-3xl'>{Number(balance).toLocaleString('ru-RU')}</p>
              {limit > 0 && (
                <p className='text-xl text-slate-400'>/ {Number(limit).toLocaleString('ru-RU')} ₽</p>
              )}
            </div>
            {limit > 0 && (
              <p className='text-slate-600'><span className='text-sm text-slate-500'>Потрачено: </span><span className='text-base'>{formatPrice(spent)}</span></p>
            )}
          </div>

          {/* Правая часть*/}
          <div className='ml-4 flex items-center justify-center'>
            <MiniCircularProgress percentage={percentage} />
          </div>

        </div>
      )
    default:
      return (
        <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='text-base font-semibold text-slate-900'>{convert.name}</div>
          <div className='mt-1 text-sm text-slate-600'>
            {typeof convert.current_amount === 'number' && <span>Текущая: {formatPrice(convert.current_amount)}</span>}
            {typeof convert.overall_limit === 'number' && <span> · Лимит: {formatPrice(convert.overall_limit)}</span>}
          </div>
        </div>
      )
  }
};
