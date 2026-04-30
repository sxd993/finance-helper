import type { Operation, OperationFilter } from "@/entities/operation";
import { client } from "@/shared/api/client";

export interface GetHistoryResponse {
  operations: Operation[];
}

export const GetHistory = async (operationType: OperationFilter): Promise<GetHistoryResponse> => {
  const response = await client.get<GetHistoryResponse>("/history", {
    params: { operation_type: operationType },
  });
  return response.data;
};

