import type { RemainderHistoryItem } from "@/entities/remainders";
import { client } from "@/shared/api/client";

export const GetRemaindersHistory = async (): Promise<RemainderHistoryItem[]> => {
  const response = await client.get<RemainderHistoryItem[]>("/remainders/history");
  return response.data;
};
