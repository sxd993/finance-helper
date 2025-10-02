import type { User } from "./types"
import { useQuery } from "@tanstack/react-query"
import { UserApi } from "../api/userApi"

interface UseUserResult {
    user: User | null,
    isAuthenticated: boolean
    isLoading: boolean,
    error: unknown
}

// Хук для получения текущего пользователя
export const useUser = (): UseUserResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: UserApi,
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