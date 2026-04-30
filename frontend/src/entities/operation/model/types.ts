export type OperationType = "expense" | "replenishment";
export type OperationSource = "spend" | "type_limit" | "remainder";
export type OperationFilter = "all" | OperationType;

export interface Operation {
  id: number;
  type: OperationType;
  source: OperationSource;
  amount: number;
  occurred_at: number;
  convert_id: number | null;
  convert_name: string;
  convert_type: string;
  convert_title?: string | null;
  title: string;
  icon_name?: string | null;
  remainder_redistribution_id?: number | null;
}

