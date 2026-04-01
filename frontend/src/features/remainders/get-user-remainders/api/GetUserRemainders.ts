import type { RemaindersResponse } from "@/entities/remainders";
import { client } from "@/shared/api/client";

export const GetUserRemainders = async (): Promise<RemaindersResponse> => {
  const response = await client.get<RemaindersResponse>("/remainders/get-user-remainders");
  return response.data;
};
