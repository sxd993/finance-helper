export interface Convert {
    id: number;
    user_id: number;
    account_id: number;
    name: string;
    category: string;
    current: number;
    target: number;
    one_transfer: number;
    nextTransfer: string;
    period_start: string;
    period_end: string;
    isComplete: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    daysLeft?: number;
    daysLeftToComplete?: number
}

export interface BalanceCardProps {
    total: number;
    income: number;
    expenses: number;
    isLoading: boolean;
}