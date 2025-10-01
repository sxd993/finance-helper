import { useQuery } from '@tanstack/react-query';

import { getUser } from '@entities/user/api/userApi';
import type { User } from '@entities/user/model/types';

export const useMockUser = () => {
    const { data: user, isLoading: isUserLoading, error } = useQuery<User>({
        queryKey: ['user'],
        queryFn: getUser,
        staleTime: 30 * 60 * 1000, // 30 минут
    })
    return { user, isUserLoading, error };
}
