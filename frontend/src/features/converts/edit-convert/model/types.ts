export interface EditConvertPayload {
  id: number;
  name: string;
  type_code: string;
  target_amount?: number | null;
  initial_amount?: number | null;
  is_active?: boolean;
}

export interface EditConvertResponse {
  id: number;
  name: string;
  type_code: string;
  target_amount: number | null;
  initial_amount: number | null;
  is_active: boolean;
}
