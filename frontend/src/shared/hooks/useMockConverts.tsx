import { useQuery } from '@tanstack/react-query';
import { getConverts } from '../api/ConvertsApi';
import type { Convert } from '../types/types';

export const useMockConverts = () => {
    const { data, isLoading, error } = useQuery<Convert[]>({
        queryKey: ['converts'],
        queryFn: getConverts,
        staleTime: 30 * 60 * 1000, // 30 минут
    });

    return {
        converts: data ?? [],
        isLoading,
        error,
    };
};
