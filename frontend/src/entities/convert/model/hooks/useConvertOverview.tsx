import { useQuery } from "@tanstack/react-query";
import { getConvertOverview } from "@entities/convert/api";
import type { ConvertGroup } from "@entities/convert/model/types"

export const useConvertOverview = () => {
  const { data, isLoading, error } = useQuery<ConvertGroup[]>({
    queryKey: ['convert-overview'],
    queryFn: getConvertOverview,
    staleTime: 30 * 60 * 1000, // 30 минут
  });

  return {
    convertOverview: data,
    isLoading,
    error,
  };

};
