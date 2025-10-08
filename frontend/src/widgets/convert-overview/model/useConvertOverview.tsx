import { useQuery } from "@tanstack/react-query";
import { GetConvertOverview } from "../api/GetConvertOverview";
import type { ConvertOverviewResponse } from "./type";

export const useConvertOverview = () => {
  const { data, isLoading, error } = useQuery<ConvertOverviewResponse>({
    queryKey: ['convert-overview'],
    queryFn: GetConvertOverview,
    staleTime: 30 * 60 * 1000, // 30 минут
  });

  return {
    convertOverview: Object.entries(data || {}),
    isLoading,
    error,
  };
};
