export interface User {
    id: number;
    login: string;
    name: string;
    monthly_income: number;
    email: string;
    currency: string;
    percent_necessary: number;
    percent_desire: number
    percent_saving: number
}

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
    category_id: number;
}

export interface Category {
    id: number;
    name: string;
    total?: number;
}

export interface Goal {
    id: number;
    title: string;
    amount: number;
    currentAmount: number;
}

export interface Convert {
    id: number;
    convert_type: 'necessary' | 'desire' | 'saving' | 'investment';
    name: string;
    current_amount: number;
    limit_amount?: number; // Для конвертов necessary и desire 
    target_amount?: number; // Для конвертов saving 
    one_transfer?: number; // Для конвертов saving 
    next_transfer?: string; // Для конвертов saving 
    period_start?: string; // Для конвертов necessary и desire 
    period_end?: string; // Для конвертов necessary и desire 
    is_complete?: boolean; // Для конвертов saving
}
