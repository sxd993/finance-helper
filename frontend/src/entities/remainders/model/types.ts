export interface Remainder {
  id: number;
  amount: number;
  start_date: string;
  end_date: string;
}

export interface RemaindersSummary {
  total_amount: number;
  items_count: number;
}

export interface RemaindersResponse {
  summary: RemaindersSummary;
  items: Remainder[];
}

export interface RemainderRedistributionSource {
  id: number;
  amount: number;
  start_date: string;
  end_date: string;
}

export interface RemainderRedistributionHistoryItem {
  id: number;
  amount: number;
  created_at: string;
  target_convert: {
    id: number;
    name: string;
    type_code: string;
  };
  sources: RemainderRedistributionSource[];
}
