import { userApi } from "../api/userApi"
import type { User } from "@/entities/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"


interface UseUserResult {
    user: User,
    isAuthenticated: boolean
    isLoading: boolean,
    error: unknown
}


export const useUser = (): UseUserResult => {
    const queryClient = useQueryClient()
    const { data, isLoading, error } = useQuery<User>({
        queryKey: ['user'],
        queryFn: userApi,
        staleTime: 30 * 60 * 1000, // 30 минут
        retry: false,
        initialData: () => queryClient.getQueryData<User>(['user']),
    })
    return {
        user: data!,
        isAuthenticated: true,
        isLoading,
        error
    }

}
