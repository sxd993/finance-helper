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

export interface RemainderHistoryItem {
  id: number;
  amount: number;
  created_at: string;
  remainder_type: {
    type_code: string;
    start_date: string;
    end_date: string;
  };
}
