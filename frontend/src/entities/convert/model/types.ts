export interface Convert {
  id: number;
  name: string;
  type: string; // например: "important"
  is_active: boolean;

  // Финансовые поля
  initial_amount: number;
  target_amount: number;
  current_balance: number;
  total_out: number;
  can_spend: boolean;

  // Доп. инфо
  code: string;
  description: string;
  has_limit: boolean;
  is_reset: boolean;
  limit: number;
  sort_order: number;
  title: string;

  type_code: string;
}



export interface ConvertType {
  id: number | null;
  code: string;
  title: string;
  description?: string | null;
  is_reset: boolean;
  has_limit: boolean;
  can_spend: boolean;
  sort_order?: number | null;
  limit: number | null;
  current_type_amount: number | null;
}

export interface ConvertInfo {
  code: string;
  title: string;
  type_id: number | null;
  is_reset: boolean;
  has_limit: boolean;
  can_spend: boolean;
  total_limit: number | null;
  used_limit: number | null;
  avaliable_limit: number | null;
  convert_type_limit: number | null;
}


export interface ConvertGroup {
  code: string
  currentSum: number
  current_convert_limit: number | null
  info: ConvertInfo
}
