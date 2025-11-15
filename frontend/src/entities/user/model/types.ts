export interface User {
  login: string;
  name: string;
  email: string;
  monthlyIncome: number | null;
  percentImportant: number;
  percentWishes: number;
  percentSaving: number;
  percentInvestment: number;
  cycleType: "monthly";
}
