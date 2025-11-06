import { client } from "@/shared/api/client";

export const getConvertOverview = async () => {
    const response = await client.get('/converts/converts-overview')
    return response.data
}