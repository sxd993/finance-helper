
import { useInvestmentForm } from '../model/useInvestmentForm'

type UpdateInvestementsFormProps = {
  convertId: number
  initial_investment?: number | null
  current_value?: number | null
  onClose?: () => void
}

export const UpdateInvestementsForm = ({ convertId, initial_investment, current_value, onClose }: UpdateInvestementsFormProps) => {
  const { register, onSubmit, isPending, formState } = useInvestmentForm({ convertId, initial_investment, current_value })

  return (
    <form onSubmit={onSubmit} className='px-6 py-2 flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-3'>
        <label className='flex flex-col'>
          <span className='text-xs text-slate-500 mb-1'>Вложено</span>
          <input
            type='number'
            step='0.01'
            className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
            {...register('initial_investment', { valueAsNumber: true })}
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-xs text-slate-500 mb-1'>Текущая стоимость</span>
          <input
            type='number'
            step='0.01'
            className='h-9 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200'
            {...register('current_value', { valueAsNumber: true })}
          />
        </label>
      </div>
      <div className='mt-2 flex justify-end gap-2'>
        {onClose && (
          <button type='button' onClick={onClose} className='h-9 px-3 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50'>Отмена</button>
        )}
        <button type='submit' disabled={isPending || formState.isSubmitting} className='h-9 px-3 rounded-md bg-primary text-white disabled:opacity-60'>
          {isPending || formState.isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
}
