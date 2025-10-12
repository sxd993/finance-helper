import { useQuery } from '@tanstack/react-query'

import { getConvertTypes } from '@entities/convert/api'
import type { ConvertType } from '@entities/convert/model/types'

export const useConvertTypes = () => {
  const { data, isLoading, error } = useQuery<ConvertType[]>({
    queryKey: ['convert-types'],
    queryFn: getConvertTypes,
    staleTime: 60 * 60 * 1000,
  })

  return {
    convert_types: data ?? [],
    isLoading,
    error,
  }
}

