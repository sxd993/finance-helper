import type { Convert, ConvertsInfo } from '../shared/types/types';

export const mockConverts: Convert[] = [
  {
    id: 1,
    convert_type: 'necessary',
    convert_name: 'Продукты',
    current_amount: 2500,
    limit_amount: 15000,
    period_start: '2024-09-02',
    period_end: '2024-09-09',
  },
  {
    id: 2,
    convert_type: 'desire',
    convert_name: 'Развлечения',
    current_amount: 1000,
    limit_amount: 8000,
    period_start: '2025-09-01',
    period_end: '2025-09-30',
    is_complete: false,
  },
  {
    id: 3,
    convert_type: 'saving',
    convert_name: 'Отпуск в Турции',
    current_amount: 25000,
    target_amount: 100000,
    one_transfer: 5000,
    next_transfer: '2025-09-15',
    is_complete: false,
  },
  {
    id: 4,
    convert_type: 'investment',
    convert_name: 'Акции IT',
    current_amount: 50000,
    is_complete: false,
  },
];

export const mockConvertsInfo: ConvertsInfo = {
  weekly_budget: 25000,
  current_budget: 25000,
  period_start: '1 сентября',
  period_end: '8 сентября'
}