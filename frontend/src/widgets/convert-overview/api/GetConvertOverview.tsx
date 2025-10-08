import { client } from "@/shared/api/client";
import type { ConvertGroup } from "../model/type";

export const GetConvertOverview = async (): Promise<ConvertGroup> => {
    const response = await client.get('/converts/converts-overview')
    return response.data
}