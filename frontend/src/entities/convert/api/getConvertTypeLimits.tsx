import { client } from "@/shared/api/client"

import type { ConvertTypeLimitsResponse } from "../model/types"

export const getConvertTypeLimits = async (): Promise<ConvertTypeLimitsResponse> => {
  const response = await client.get("/converts/type-limits")
  return response.data
}
