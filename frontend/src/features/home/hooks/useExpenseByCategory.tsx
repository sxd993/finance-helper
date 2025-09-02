import { useQuery } from "@tanstack/react-query"
import { GetExpensesByCategories } from "../api/ExpensesByCategories"

export interface ExpensesByCategories {
  category_id: number;
  category_name: string;
  total_amount: number;
  transaction_count: number;
  last_transaction_date?: string;
}

export const useExpenseByCategory = () => {
    const {data, isLoading, error} = useQuery<ExpensesByCategories[]>({
        queryKey: ['expenses-by-category'],
        queryFn: GetExpensesByCategories
    })
    return {
        Expenses: data || [],
        isLoading,
        error

    }
}