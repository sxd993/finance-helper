import { client } from "@/shared/api/client";

export const deleteConvert = async (id: number) => {
    const response = await client.delete(`/converts/delete-convert/${id}`);
    return response.data;
};

