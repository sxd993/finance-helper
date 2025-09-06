export interface User {
    id: number;
    login: string;
    name: string ;
    monthly_income: number;
    email: string;
    currency: string;
    percent_necessary: number;
    percent_desire: number
    percent_saving: number
}

export interface Convert {
    id: number;
    convert_type: 'necessary' | 'desire' | 'saving' | 'investment';
    convert_name: string;
    current_amount: number;
    limit_amount?: number; // Для конвертов necessary и desire 
    target_amount?: number; // Для конвертов saving 
    one_transfer?: number; // Для конвертов saving 
    next_transfer?: string; // Для конвертов saving 
    period_start?: string; // Для конвертов necessary и desire 
    period_end?: string; // Для конвертов necessary и desire 
    is_complete?: boolean; // Для конвертов saving
}

export interface ConvertsInfo {
    weekly_budget: number;
    current_budget: number;
    percentage?: number;
    period_start: string;
    period_end: string
}

export interface Transaction {
    id: number;
    transactions_category: 'necessary' | 'desire' | 'saving' | 'investment';
    transactions_subcategory: string;
    transactions_name: string;
    transactions_amount: number;
    transactions_date: string;
}