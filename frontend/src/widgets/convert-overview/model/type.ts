export interface ConvertMeta {
  id: number;
  title: string;
  hasLimit: boolean;
  accumulates: boolean;
}

export interface ConvertGroup {
  currentSum: number;
  totalSum: number;
  targetAmount: number | null;
  meta: ConvertMeta;
}

export type ConvertOverviewResponse = Record<string, ConvertGroup>;
