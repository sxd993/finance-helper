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
