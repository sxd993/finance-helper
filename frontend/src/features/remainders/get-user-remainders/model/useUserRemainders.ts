import { useQuery } from "@tanstack/react-query";

import type { Remainder } from "@/entities/remainders";

import { GetUserRemainders } from "../api/GetUserRemainders";

export const useUserRemainders = () => {
  const { data, isLoading, error } = useQuery<Remainder[]>({
    queryKey: ["remainders"],
    queryFn: GetUserRemainders,
  });

  return {
    remainders: data ?? [],
    isLoading,
    error,
  };
};
