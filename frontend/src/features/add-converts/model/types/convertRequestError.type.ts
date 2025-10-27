export interface ConvertRequestError {
  message: string;
  code?: string;
  status?: number;
  details?: {
    limit?: number;
    used?: number;
    required?: number;
    available?: number;
    existingId?: number;
  };
}

