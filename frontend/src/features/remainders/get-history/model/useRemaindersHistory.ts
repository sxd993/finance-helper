import { useQuery } from "@tanstack/react-query";

import type { RemainderRedistributionHistoryItem } from "@/entities/remainders";

import { GetRemaindersHistory } from "../api/GetRemaindersHistory";

export const useRemaindersHistory = () => {
  const { data, isLoading, error } = useQuery<RemainderRedistributionHistoryItem[]>({
    queryKey: ["remainders-history"],
    queryFn: GetRemaindersHistory,
  });

  return {
    history: data ?? [],
    isLoading,
    error,
  };
};
