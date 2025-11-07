
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { GetUserConverts } from '../../get-user-converts/api/GetUserConverts'
import { GetUserConvertsLimits } from '../api/GetUserConvertsLimits'

const PREFETCH_STALE_TIME = 30 * 60 * 1000

export const usePrefetchConvertsData = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['converts'],
      queryFn: GetUserConverts,
      staleTime: PREFETCH_STALE_TIME,
    })

    queryClient.prefetchQuery({
      queryKey: ['converts', 'limits'],
      queryFn: GetUserConvertsLimits,
      staleTime: PREFETCH_STALE_TIME,
    })
  }, [queryClient])
}
