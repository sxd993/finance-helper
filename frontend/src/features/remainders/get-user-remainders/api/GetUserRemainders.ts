import type { Remainder } from "@/entities/remainders";
import { client } from "@/shared/api/client";

export const GetUserRemainders = async (): Promise<Remainder[]> => {
  const response = await client.get<Remainder[]>("/remainders/get-user-remainders");
  return response.data;
};
