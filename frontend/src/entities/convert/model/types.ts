export interface Convert {
  id: number;
  convert_type: 'necessary' | 'desire' | 'saving' | 'investment';
  convert_name: string;
  current_amount: number;
  limit_amount?: number;
  target_amount?: number;
  one_transfer?: number;
  next_transfer?: string;
  period_start?: string;
  period_end?: string;
  is_complete?: boolean;
  account_id?: number;
  current?: number;
  target?: number;
}

export interface ConvertsInfo {
  weekly_budget: number;
  current_budget: number;
  percentage?: number;
  period_start: string;
  period_end: string;
}
