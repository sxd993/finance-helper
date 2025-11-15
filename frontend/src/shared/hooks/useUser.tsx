import { userApi } from "../api/userApi"
import type { User } from "@/entities/user"
import { useQuery } from "@tanstack/react-query"


interface UseUserResult {
    user: User | null,
    isAuthenticated: boolean
    isLoading: boolean,
    error: unknown
}


export const useUser = (): UseUserResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: userApi,
        staleTime: 30 * 60 * 1000, // 30 минут
        retry: false,
    })
    return {
        user: data ?? null,
        isAuthenticated: !!data && !error,
        isLoading,
        error
    }
}