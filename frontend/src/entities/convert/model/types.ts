export interface Convert {
  id: number;
  type: ConvertType;
  name: string;
  overall_limit?: number;
  current_amount: number;
  target_amount?: number;
  initial_investment?: number;
  current_value?: number;
  last_updated?: string;
}

export interface ConvertType {
  id: number;
  code: string;
  title: string;
  limit: number | null;
  current_type_amount: number | null;
}

export interface ConvertInfo {
  code: string;
  title: string;
  type_id: number;
  total_limit: number | null;
  used_limit: number | null;
  avaliable_limit: number | null;
}

export interface ConvertGroup {
  currentSum: number;
  totalSum: number | null;
  targetAmount: number | null;
  info: ConvertInfo;
}

export type ConvertOverviewResponse = Record<string, ConvertGroup>;

