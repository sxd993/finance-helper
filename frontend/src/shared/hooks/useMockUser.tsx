import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/UserApi';
import type { User } from '../types/types';


export const useMockUser = () => {
    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['user'],
        queryFn: getUser,
        staleTime: 30 * 60 * 1000, // 30 минут
    })
    return { user, isLoading, error };
}