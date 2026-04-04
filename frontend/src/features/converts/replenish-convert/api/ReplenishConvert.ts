import type { ConvertTab } from "@/entities/convert";
import { client } from "@/shared/api/client";

export interface ReplenishConvertRequest {
  type_code: ConvertTab;
  convert_id: number;
  amount: number;
}

export interface ReplenishConvertResponse {
  convert: {
    id: number;
    name: string;
    type_code: string;
    current_amount: number;
  };
  limit: {
    type_code: string;
    allocated_amount: number;
    remainder_amount: number;
  };
}

export const ReplenishConvert = async (payload: ReplenishConvertRequest) => {
  const { data } = await client.post<ReplenishConvertResponse>(
    "/converts/replenish-convert",
    payload,
  );
  return data;
};
