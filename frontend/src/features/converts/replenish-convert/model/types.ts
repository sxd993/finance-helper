export type ReplenishSourceType = "saving" | "investment";

export interface ReplenishFormValues {
  sourceType: ReplenishSourceType | "";
  convertId: string;
  amount: number;
}

export interface SourceTypeOption {
  value: ReplenishSourceType;
  label: string;
  remainder: number;
}
