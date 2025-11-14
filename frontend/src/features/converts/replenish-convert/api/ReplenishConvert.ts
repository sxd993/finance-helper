import type { ConvertTab } from "@/features/ui/switch-convert-tabs/store/ConvertTabs.slice";
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
    initial_amount: number;
  };
  limit: {
    type_code: string;
    distributed_amount: number;
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
