export type RegisterStep = 'userInfo' | 'userOnboarding' | 'userSettings';

export interface RegisterFormData {
    login: string;
    name: string;
    email: string;
    password: string;
    monthly_income: number;
    cycle_type: 'monthly';
    percentImportant: number;
    percentWishes: number;
    percentSaving: number;
    percentInvestment: number;
    personalDataConsent: boolean;
    privacyPolicyAccepted: boolean;
}

export interface LoginFormData {
    login: string;
    password: string;
}
