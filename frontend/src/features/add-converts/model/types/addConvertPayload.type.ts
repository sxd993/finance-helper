export interface CreateConvertPayload {
  name: string;
  type_code: string; // important | wishes | saving | investment
  is_active?: boolean;
  // Распределение бюджета
  monthly_limit?: number | null;
  overall_limit?: number | null;
  current_amount?: number | null;
  // Накопление
  target_amount?: number | null;
  // Инвестиции
  initial_investment?: number | null;
  current_value?: number | null;
}
