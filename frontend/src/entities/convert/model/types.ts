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

export interface ConvertType {
  id: number;
  code: string;
  title: string;
  hasLimit: boolean;
  accumulates: boolean;
}

export interface CreateConvertPayload {
  name: string;
  type_code: string;
  current_amount?: number | null;
  target_amount?: number | null;
  is_active?: boolean;
}
