import { useQuery } from '@tanstack/react-query'
import { GetUserConvertsLimits } from '../api/GetUserConvertsLimits'
import type { UseUserConvertsLimitsResult, UserConvertLimit } from './types'


export const useUserConvertsLimits = (): UseUserConvertsLimitsResult => {
  const { data, isLoading, error } = useQuery<UserConvertLimit[]>({
    queryKey: ['converts'],
    queryFn: GetUserConvertsLimits,
    staleTime: 30 * 60 * 1000,
  })

  return {
    userConvertsLimits: data || null,
    isLoading,
    error,
  }
}