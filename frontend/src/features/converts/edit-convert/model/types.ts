export interface EditConvertPayload {
  id: number;
  name: string;
  type_code: string;
  monthly_limit?: number | null;
  funded_amount?: number | null;
  goal_amount?: number | null;
  saved_amount?: number | null;
  invested_amount?: number | null;
  current_value?: number | null;
  // legacy ui fields
  target_amount?: number | null;
  initial_amount?: number | null;
  is_active?: boolean;
}

export interface EditConvertResponse {
  id: number;
  name: string;
  type_code: string;
  is_active: boolean;
}
