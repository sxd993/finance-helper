export interface addConvertPayload {
    name: string;
    type_code: string;
    current_amount?: number | null;
    target_amount?: number | null;
    is_active?: boolean;
}