import type { RemainderRedistributionHistoryItem } from "@/entities/remainders";
import { client } from "@/shared/api/client";

export const GetRemaindersHistory = async (): Promise<RemainderRedistributionHistoryItem[]> => {
  const response = await client.get<RemainderRedistributionHistoryItem[]>("/remainders/history");
  return response.data;
};
