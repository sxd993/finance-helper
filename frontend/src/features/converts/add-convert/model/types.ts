export interface CreateConvertPayload {
    name: string;
    type_code: string; // important | wishes | saving | investment
    is_active?: boolean;
    current_amount?: number | null;
    target_amount?: number | null;
    initial_amount?: number | null;
    current_value?: number | null;
}

export interface CreateConvertResponse {
    id: number;
    name: string;
    type_code: string;
    is_active: boolean;
    target_amount: number | null;
    initial_amount: number | null;
}

export interface ConvertErrorResponse {
    message?: string;
    code?: string;
    limit?: number;
    used?: number;
    required?: number;
    available?: number;
    existing_id?: number;
}

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

