import { client } from "@/shared/api/client";
import type {
  ChangePercentApiPayload,
  ChangePercentResponse,
} from "../model/types";

export const updateDistributionApi = async (payload: ChangePercentApiPayload) => {
  const response = await client.patch<ChangePercentResponse>(
    "/settings/change-percent",
    payload,
  );

  return response.data;
};
