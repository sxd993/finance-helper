import { formatPrice } from '@/shared/utils/formatPrice';
import type { Convert } from '../../model/types';
import { Edit3 } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { UpdateInvestementsForm } from '@/features/update-convert-investements/ui/UpdateInvestementsForm';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/ui/Modal/model/useModal';

type Props = {
  convert: Convert;
  currentValue: number;
  initialValue: number;
  returnPercentage: number;
  absoluteReturn: number;
  isProfit: boolean;
  isLoss: boolean;
};

export const InvestmentConvertCard = ({
  convert,
  currentValue,
  initialValue,
  returnPercentage,
  absoluteReturn,
  isProfit,
  isLoss,
}: Props) => {
  const { isOpen, open, close } = useModal(`invest-card-${convert.id}`);
  const colorClass = isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-600';
  const percentage = returnPercentage.toFixed(2)
  return (
    <div className='flex justify-between items-center py-3 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
      захожу сюда и должна быть плашка сколько доступно средств для распределения

      берется из converts_types
      {/* Левая часть*/}
      <div className='h-full flex flex-col justify-between flex-1'>
        <div className="flex items-center gap-2">
          <h4 className="text-md text-slate-600">{convert.name}</h4>
        </div>
        <div className='flex items-baseline gap-2 justify-start'>
          <p className='text-black text-xl'>{formatPrice(currentValue)}</p>
        </div>
        <div className='text-sm text-slate-600'>
          <div>
            <span className='text-slate-500'>Вложено: </span>
            <span className='font-medium'>{formatPrice(initialValue)}</span>
          </div>
          <div>
          </div>
        </div>
      </div>


      {/* Правая часть*/}
      <div className='flex flex-col gap-2'>
        <div className='flex justify-center'>
          <span className={colorClass}>{formatPrice(absoluteReturn)}</span>
          <span className='text-slate-300 px-1'>•</span>
          <span className={colorClass}>{percentage}%</span>
        </div>
        <Button
          title='Изменить'
          bg='white'
          text='slate-700'
          size='sm'
          onClick={open}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title={
          <div className='flex items-center gap-2 justify-center'>
            <Edit3 className='w-4 h-4 text-slate-700' />
            <span>Обновить инвестицию</span>
          </div>
        }
      >
        <UpdateInvestementsForm
          convertId={convert.id}
          initial_amount={initialValue}
          target_amount={currentValue}
          onClose={close}
        />
      </Modal>
    </div>
  );
};
