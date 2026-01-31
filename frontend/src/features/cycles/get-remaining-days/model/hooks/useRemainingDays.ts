import { useQuery } from "@tanstack/react-query"
import { GetRemainingDaysApi } from "../../api/GetRemainingDaysApi"

export const useRemainingDays = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['remaining-days'],
        queryFn: GetRemainingDaysApi,
        staleTime: 30 * 60 * 1000,
    })

    return {
        remainingDays: data?.daysRemaining ?? 0,
        isLoading,
        error,
    }
}
