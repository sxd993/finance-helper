import { useState } from 'react';
import { formatPrice } from '@/shared/utils/formatPrice';
import type { Convert } from '../../model/types';
import { TrendingUp, TrendingDown, Minus, Edit3 } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { UpdateInvestementsForm } from '@/features/update-convert-investements/ui/UpdateInvestementsForm';
import { Button } from '@/shared/ui/Button';

type Props = {
  convert: Convert;
  balance: number;
  returnPercentage: number;
  absoluteReturn: number;
  isProfit: boolean;
  isLoss: boolean;
};

export const InvestmentConvertCard = ({ convert, balance, returnPercentage, absoluteReturn, isProfit, isLoss }: Props) => {
  const [isInvestOpen, setInvestOpen] = useState(false);
  const colorClass = isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600';
  const percentText = `${Math.abs(returnPercentage).toFixed(2)}%`;
  const signedAmount = isProfit
    ? Math.abs(absoluteReturn)
    : isLoss
      ? Math.abs(absoluteReturn)
      : 0;

  return (
    <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>

      {/* Левая часть*/}
      <div className='h-full flex flex-col justify-between flex-1'>
        <div className="flex items-center gap-2">
          <h4 className="text-md text-slate-600">{convert.name}</h4>
        </div>
        <div className='flex items-baseline gap-2 justify-start'>
          <p className='text-black text-xl'>{formatPrice(convert.current_value ?? balance)}</p>
        </div>
        <div className='text-sm text-slate-600'>
          <div>
            <span className='text-slate-500'>Вложено: </span>
            <span className='font-medium'>{formatPrice(convert.initial_investment ?? 0)}</span>
          </div>
          <div>
          </div>
        </div>
      </div>


      {/* Правая часть*/}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center'>
          <span className={`text-sm font-semibold ${colorClass}`}>
            {formatPrice(signedAmount)}
          </span>
          <span className='text-slate-300'>•</span>
          <span className={colorClass}>{percentText}</span>
        </div>
        <Button
          title='Изменить'
          bg='white'
          text='slate-700'
          size='sm'
          onClick={() => setInvestOpen(true)}
        />
      </div>
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
    </div>
  );
};
