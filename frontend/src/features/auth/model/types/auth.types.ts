export type RegisterStep = 'userInfo' | 'userOnboarding' | 'userSettings';

export interface RegisterFormData {
    login: string;
    name: string;
    email: string;
    password: string;
    distributionMode: 'baseline' | 'flex';
    monthly_income: number;
    cycle_type: 'monthly' | 'weekly';
}

export interface LoginFormData {
    login: string;
    password: string;
}
