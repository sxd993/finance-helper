export interface User {
    id: number;
    login: string;
    name: string;
    balance: number;
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