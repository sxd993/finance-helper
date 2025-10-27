export interface ConvertErrorResponse {
  message?: string;
  code?: string;
  limit?: number;
  used?: number;
  required?: number;
  available?: number;
  existing_id?: number;
}

