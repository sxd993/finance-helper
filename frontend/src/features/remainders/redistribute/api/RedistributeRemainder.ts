import { client } from "@/shared/api/client";

export interface RedistributeRemainderRequest {
  convert_id: number;
  amount: number;
}

export interface RedistributeRemainderResponse {
  summary: {
    total_amount: number;
  };
  redistribution: {
    id: number;
    amount: number;
    created_at: string;
    target_convert: {
      id: number;
      name: string;
      type_code: string;
    };
  };
}

export const RedistributeRemainder = async (
  payload: RedistributeRemainderRequest
): Promise<RedistributeRemainderResponse> => {
  const response = await client.post<RedistributeRemainderResponse>("/remainders/redistribute", payload);
  return response.data;
};
