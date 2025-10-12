export interface Convert {
  id: number;
  type_id: ConvertType;
  name: string;
  overall_limit?: number;
  current_amount: number;
  target_amount?: number;
  // Investment-specific fields
  initial_investment?: number;
  current_value?: number;
  last_updated?: string;
}

export interface ConvertType {
  id: number;
  code: string;
  title: string;
}

export interface ConvertInfo {
  code: string;
  title: string;
  type_id: number;
  total_limit: number;
  used_limit: number;
  avaliable_limit: number
}

export interface ConvertGroup {
  currentSum: number;
  totalSum: number;
  targetAmount: number | null;
  info: ConvertInfo;
}

export type ConvertOverviewResponse = Record<string, ConvertGroup>;


