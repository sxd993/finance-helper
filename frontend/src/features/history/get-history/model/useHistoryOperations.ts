import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { OperationFilter } from "@/entities/operation";
import { GetHistory } from "../api/GetHistory";
import { groupOperationsByDate } from "../lib/groupOperationsByDate";

export const useHistoryOperations = (operationType: OperationFilter) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["history", operationType],
    queryFn: () => GetHistory(operationType),
  });

  const operations = data?.operations ?? [];
  const operationGroups = useMemo(() => groupOperationsByDate(operations), [operations]);

  return { operations, operationGroups, error, isLoading };
};

