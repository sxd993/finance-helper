export interface CreateConvertResponse {
  id: number;
  name: string;
  type_code: string;
  is_active: boolean;
  target_amount: number | null;
  initial_amount: number | null;
}

