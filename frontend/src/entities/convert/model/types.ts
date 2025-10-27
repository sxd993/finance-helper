export interface Convert {
  id: number;
  name: string;
  type_code: string;
  is_active: boolean;

  // Цели и суммы
  target_amount: number | null;   // лимит накопления (может быть null)
  initial_amount: number;         // стартовая сумма в конверте
  total_in: number;               // сколько всего внесено (обычно = initial_amount)
  total_out: number;              // сколько всего потрачено
  balance: number;                // остаток = initial_amount - total_out
  current_balance: number;          // alias для balance (удобно для UI)

  // Информация о типе
  type: {
    code: string;
    title: string;
    description: string | null;
    is_reset: boolean;
    has_limit: boolean;
    can_spend: boolean;
    sort_order: number | null;
    limit: number | null;
  } | null;
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
}


export interface ConvertGroup {
  code: string
  currentSum: number
  current_convert_limit: number | null
  info: ConvertInfo
}
