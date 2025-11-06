import { useQuery } from '@tanstack/react-query'

import { GetUserConverts } from '../api/GetUserConverts'
import type { Convert } from '@entities/convert/model/types'

export const useUserConverts = () => {
  const { data, isLoading, error } = useQuery<Convert[]>({
    queryKey: ['converts'],
    queryFn: GetUserConverts,
    staleTime: 30 * 60 * 1000,
  })

  return {
    converts: data || null,
    isLoading,
    error,
  }
}

