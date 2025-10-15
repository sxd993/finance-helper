export interface CreateConvertPayload {
  name: string;
  type_code: string; // important | wishes | saving | investment
  is_active?: boolean;
  current_amount?: number | null;
  target_amount?: number | null;
  initial_amount?: number | null;
  current_value?: number | null;
}
