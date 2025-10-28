import { useQuery } from "@tanstack/react-query"

import { getConvertTypeLimits } from "@/entities/convert/api"
import type { ConvertTypeLimitsResponse } from "@/entities/convert/model/types"

export const useConvertTypeLimits = () => {
  const { data, isLoading, error } = useQuery<ConvertTypeLimitsResponse>({
    queryKey: ["convert-type-limits"],
    queryFn: getConvertTypeLimits,
    staleTime: 15 * 60 * 1000,
  })

  return {
    convertTypeLimits: data,
    isLoading,
    error,
  }
}
