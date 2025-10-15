import { client } from "@/shared/api/client";
import type { Convert } from "../model/types";

export const editConvert = async (id: string, payload: Partial<Convert>) => {
    const response = await client.patch(`/converts/${id}`, payload);
    return response.data
}

