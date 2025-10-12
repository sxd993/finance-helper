import { client } from "@/shared/api/client";
import type { ConvertOverviewResponse } from "../model/types";

export const getConvertOverview = async (): Promise<ConvertOverviewResponse> => {
    const response = await client.get('/converts/converts-overview')
    return response.data
}
