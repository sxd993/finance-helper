export interface Convert {
  id: number;
  type_code: string;
  type: ConvertType | null;
  name: string;
  is_active: boolean;
  target_amount?: number;
  initial_amount: number;
  current_value?: number;
  balance: number;
  total_in: number;
  total_out: number;
}

export interface ConvertType {
  id: number | null;
  code: string;
  title: string;
  description?: string | null;
  sort_order?: number | null;
  limit: number | null;
  current_type_amount: number | null;
}

export interface ConvertInfo {
  code: string;
  title: string;
  type_id: number | null;
  total_limit: number | null;
  used_limit: number | null;
  avaliable_limit: number | null;
}

export interface ConvertGroup {
  currentSum: number;
  totalSum: number | null;
  targetAmount: number | null;
  info: ConvertInfo | null;
}

export type ConvertOverviewResponse = Record<string, ConvertGroup>;
