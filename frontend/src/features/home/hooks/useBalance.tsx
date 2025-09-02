import { useQuery } from "@tanstack/react-query"
import { getBalance } from "../api/BalanceApi"

export interface balanceData {
    income: number,
    balance: number,
    expenses: number

}

export const useBalance = () => {
    const { data, isLoading, error } = useQuery<balanceData>({
        queryKey: ['balance'],
        queryFn: getBalance
    })
     return { 
        balanceData: data || null,
        isLoading, 
        error 
    };
}