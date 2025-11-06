import { client } from "@/shared/api/client";

export const DeleteConvert = async (id: number) => {
    const response = await client.delete(`/converts/delete-convert/${id}`);
    return response.data;
};

