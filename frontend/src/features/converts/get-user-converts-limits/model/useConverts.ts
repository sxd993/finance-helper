import { useQuery } from '@tanstack/react-query'
import { GetUserConvertsLimits } from '../api/GetUserConvertsLimits'


export const useUserConverts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['converts'],
    queryFn: GetUserConvertsLimits,
    staleTime: 30 * 60 * 1000,
  })

  return {
    converts: data || null,
    isLoading,
    error,
  }
}

