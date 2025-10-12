import { useQuery } from '@tanstack/react-query'

import { getConverts } from '@entities/convert/api'
import type { Convert } from '@entities/convert/model/types'

export const useConverts = () => {
  const { data, isLoading, error } = useQuery<Convert[]>({
    queryKey: ['converts'],
    queryFn: getConverts,
    staleTime: 30 * 60 * 1000,
  })

  return {
    converts: data ?? [],
    isLoading,
    error,
  }
}

