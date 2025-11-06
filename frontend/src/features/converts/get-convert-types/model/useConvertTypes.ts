import { useQuery } from '@tanstack/react-query'

import { GetConvertTypes } from '../api/GetConvertTypes'
import type { ConvertType } from '@entities/convert/model/types'

export const useConvertTypes = () => {
  const { data, isLoading, error } = useQuery<ConvertType[]>({
    queryKey: ['convert-types'],
    queryFn: GetConvertTypes,
    staleTime: 60 * 60 * 1000,
  })

  return {
    convert_types: data ?? [],
    isLoading,
    error,
  }
}

