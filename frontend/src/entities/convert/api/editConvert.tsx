import { client } from "@/shared/api/client";
import type { EditConvertPayload } from "@/features/edit-convert/model/type";

export const editConvert = async (data: Partial<EditConvertPayload>) => {
    const response = await client.patch(`/converts/edit-convert/${data.id}`, data);
    return response.data
}

