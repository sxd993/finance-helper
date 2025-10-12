import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  initial_investment?: number;
  current_value?: number;
  onSave: (values: { initial_investment: number; current_value: number }) => Promise<void> | void;
};

export const EditInvestmentModal: React.FC<Props> = ({ open, onClose, initial_investment, current_value, onSave }) => {
  const [initialInvestment, setInitialInvestment] = useState<string>(
    initial_investment != null ? String(initial_investment) : ''
  );
  const [currentValue, setCurrentValue] = useState<string>(
    current_value != null ? String(current_value) : ''
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const ii = Number(initialInvestment) || 0;
    const cv = Number(currentValue) || 0;
    setLoading(true);
    try {
      await onSave({ initial_investment: ii, current_value: cv });
      toast.success('Инвестиция обновлена');
      onClose();
    } catch (e) {
      toast.error('Не удалось обновить инвестицию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={
      <div className='flex items-center gap-2 justify-center'>
        <Edit3 className='w-4 h-4 text-slate-700' />
        <span>Обновить инвестицию</span>
      </div>
    }>
      <div className='px-6'>
        <div className='grid grid-cols-2 gap-3'>
          <label className='flex flex-col'>
            <span className='text-xs text-slate-500 mb-1'>Вложено</span>
            <input
              type='number'
              step='0.01'
              className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-xs text-slate-500 mb-1'>Текущая стоимость</span>
            <input
              type='number'
              step='0.01'
              className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          </label>
        </div>
        <div className='mt-6 flex justify-end gap-2'>
          <button onClick={onClose} className='h-9 px-3 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50'>Отмена</button>
          <button onClick={handleSave} disabled={loading} className='h-9 px-3 rounded-md bg-primary text-white disabled:opacity-60'>
            {loading ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
