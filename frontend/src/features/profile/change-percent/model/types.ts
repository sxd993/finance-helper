export interface ChangePercentFormValues {
  percentImportant: number;
  percentWishes: number;
  percentSaving: number;
  percentInvestment: number;
}

export type DistributionFieldKey = keyof ChangePercentFormValues;

export interface ChangePercentApiPayload {
  percentImportant: number;
  percentWishes: number;
  percentSaving: number;
  percentInvestment: number;
}

export interface ChangePercentResponse {
  message: string;
  distribution: {
    percentImportant: number;
    percentWishes: number;
    percentSaving: number;
    percentInvestment: number;
  };
}
