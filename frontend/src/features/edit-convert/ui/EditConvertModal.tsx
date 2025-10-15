import type { Convert } from "@/entities/convert";
import { useEditConvertForm } from "../model/useEditConvertForm";

interface EditConvertModalProps
  extends Pick<Convert, "id" | "name" | "overall_limit" | "current_amount" | "target_amount" | "initial_investment"> {
  convert_type_limit?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const EditConvertModal = ({
  id,
  name,
  overall_limit,
  convert_type_limit,
  onClose,
}: EditConvertModalProps) => {
  const { register, onSubmit, isPending, formState } = useEditConvertForm({
    id,
    name,
    overall_limit,
  });
  return (
    <form onSubmit={onSubmit}>
      <h1>Лимит: {convert_type_limit}</h1>
      <div className='grid grid-rows-3 gap-3'>
        <label className='flex flex-col'>
          <span className='text-xs text-slate-500 mb-1'>Название</span>
          <input
            type='string'
            step='0.01'
            className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
            {...register('name')}
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-xs text-slate-500 mb-1'>Текущий лимит на конверт</span>
          <input
            type='number'
            step='0.01'
            className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
            {...register('overall_limit', { valueAsNumber: true })}
          />
        </label>
      </div>
      <div className='mt-2 flex justify-center gap-2'>
        {onClose && (
          <button type='button' onClick={onClose} className='h-9 px-3 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50'>Отмена</button>
        )}
        <button type='submit' disabled={isPending || formState.isSubmitting} className='h-9 px-3 rounded-md bg-primary text-white disabled:opacity-60'>
          {isPending || formState.isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};
