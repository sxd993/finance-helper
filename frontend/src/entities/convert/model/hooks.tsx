import { useQuery } from '@tanstack/react-query';

import { getConverts, getConvertsInfo } from '@entities/convert/api/convertsApi';
import type { Convert, ConvertsInfo } from '@entities/convert/model/types';

export const useConverts = () => {
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

export const useConvertsInfo = () => {
    const { data, isLoading: isConvertsInfoLoading, error } = useQuery<ConvertsInfo>({
        queryKey: ['converts-info'],
        queryFn: getConvertsInfo,
        staleTime: 30 * 60 * 1000, // 30 минут
    });

    return {
        converts_info: data,
        isConvertsInfoLoading,
        error,
    };

};
