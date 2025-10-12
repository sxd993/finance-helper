import { MiniCircularProgress } from '@/shared/ui/MiniCircularProgress';
import { useMemo, useState } from 'react';
import type { Convert } from '../model/types';
import { formatPrice } from '@/shared/utils/formatPrice';
import { computeConvertMetrics } from '@/shared/utils/convertMetrics';
import { TrendingUp, TrendingDown, Minus, Edit3 } from 'lucide-react';
import { EditInvestmentModal } from './EditInvestmentModal';
import { updateInvestment } from '@/entities/convert/api';
import { useQueryClient } from '@tanstack/react-query';

type ConvertCardProps = {
  convert: Convert;
};


export const ConvertCard = ({ convert }: ConvertCardProps) => {
  const { balance, limit, spent, percentage, goal_percentage, remaining_to_goal, returnPercentage, absoluteReturn, isProfit, isLoss } = computeConvertMetrics(convert);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);


  switch (convert.type_id.code) {
    case 'important':
      return (
        <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>

          {/* Левая часть */}
          <div className='h-full flex flex-col justify-between flex-1'>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-md text-slate-600">{convert.name}</h4>
            </div>
            <div className='flex items-baseline gap-2 justify-start mb-1'>
              <p className='text-black text-3xl'>{formatPrice(balance)}</p>
              {limit > 0 && (
                <p className='text-xl text-slate-400'>/ {formatPrice(limit)}</p>
              )}
            </div>
            {limit > 0 && (
              <p className='text-slate-600'><span className='text-sm text-slate-500'>Потрачено: </span><span className='text-base'>{formatPrice(spent)}</span></p>
            )}
          </div>

          {/* Правая часть*/}
          <div className='ml-1 flex items-center justify-center'>
            <MiniCircularProgress percentage={percentage} />
          </div>
        </div>
      )
    case 'wishes':
      return (
        <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>

          {/* Левая часть */}
          <div className='h-full flex flex-col justify-between'>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-md text-slate-600">{convert.name}</h4>
            </div>
            <div className='flex items-baseline gap-2 justify-start mb-1'>
              <p className='text-black text-3xl'>{formatPrice(balance)}</p>
              {limit > 0 && (
                <p className='text-xl text-slate-400'>/ {formatPrice(limit)}</p>
              )}
            </div>
            {limit > 0 && (
              <p className='text-slate-600'><span className='text-sm text-slate-500'>Потрачено: </span><span className='text-base'>{formatPrice(spent)}</span></p>
            )}
          </div>

          {/* Правая часть*/}
          <div className='ml-1 flex items-center justify-center'>
            <MiniCircularProgress percentage={percentage} />
          </div>
        </div>
      )
    case 'saving':
      return (
        <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
          {/* Левая часть */}
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


          {/* Правая часть*/}
          <div className='ml-1 flex items-center justify-center'>
            <MiniCircularProgress percentage={goal_percentage} />
          </div>
        </div>
      )
    case "investment":
      return (
        <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
          {/* Левая часть */}
          <div className='h-full flex flex-col justify-between flex-1'>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-md text-slate-600">{convert.name}</h4>
            </div>
            <div className='flex items-baseline gap-2 justify-start mb-1'>
              <p className='text-black text-3xl'>{formatPrice(convert.current_value ?? balance)}</p>
            </div>
            <div className='text-xs text-slate-600'>
              <span className='text-slate-500'>Вложено: </span>
              <span className='font-medium'>{formatPrice(convert.initial_investment ?? 0)}</span>
              <span className='mx-2 text-slate-400'>·</span>
              <span className='text-slate-500'>Доходность: </span>
              <span className={`font-medium ${isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600'}`}>{returnPercentage.toFixed(2)}%</span>
              <span className='mx-2 text-slate-400'>·</span>
              <span className='text-slate-500'>P/L: </span>
              <span className={`font-medium ${isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600'}`}>{formatPrice(absoluteReturn)}</span>
            </div>
            {convert.last_updated && (
              <div className='mt-1 text-[10px] text-slate-400'>Обновлено: {new Date(convert.last_updated).toLocaleString('ru-RU')}</div>
            )}
          </div>

          {/* Разделитель */}
          <div className='mx-3 w-[1px] self-stretch bg-gradient-to-b from-slate-100 via-slate-300 to-slate-100 rounded-full' />

          {/* Правая часть: статус + действие */}
          <div className='ml-1 flex items-center justify-center gap-3'>
            <div className='flex items-center gap-2'>
              {isProfit ? (
                <TrendingUp className='w-4 h-4 text-emerald-600' />
              ) : isLoss ? (
                <TrendingDown className='w-4 h-4 text-rose-600' />
              ) : (
                <Minus className='w-4 h-4 text-slate-500' />
              )}
              <span className={`text-sm font-semibold ${isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600'}`}>
                {returnPercentage.toFixed(2)}%
              </span>
            </div>
            <button
              className='inline-flex items-center gap-1 h-8 px-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50'
              onClick={() => setModalOpen(true)}
            >
              <Edit3 className='w-4 h-4' />
              <span className='text-xs font-medium'>Обновить</span>
            </button>
          </div>

          <EditInvestmentModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initial_investment={convert.initial_investment}
            current_value={convert.current_value}
            onSave={async ({ initial_investment, current_value }) => {
              await updateInvestment({ id: convert.id, initial_investment, current_value });
              await queryClient.invalidateQueries({ queryKey: ['converts'] });
            }}
          />
        </div>
      )
  }
};
