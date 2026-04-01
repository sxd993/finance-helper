import { useQuery } from "@tanstack/react-query";

import type { RemaindersResponse } from "@/entities/remainders";

import { GetUserRemainders } from "../api/GetUserRemainders";

export const useUserRemainders = () => {
  const { data, isLoading, error } = useQuery<RemaindersResponse>({
    queryKey: ["remainders"],
    queryFn: GetUserRemainders,
  });

  return {
    remainders: data?.items ?? [],
    summary: data?.summary ?? { total_amount: 0, items_count: 0 },
    isLoading,
    error,
  };
};
