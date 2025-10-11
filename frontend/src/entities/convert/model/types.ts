export interface Convert {
  id: number;
  type_id: ConvertType;
  name: string;
  current_amount?: number;
  target_amount?: number;
}

export interface ConvertType {
  id: number;
  code: string;
  title: string;
}

export interface CreateConvertPayload {
  name: string;
  type_code: string;
  current_amount?: number | null;
  target_amount?: number | null;
  is_active?: boolean;
}


