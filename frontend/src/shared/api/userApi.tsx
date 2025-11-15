import type { User } from "@/entities/user";
import { client } from "@/shared/api/client";

export const userApi = async () => {
    const response = await client.get<User>('/auth/check');
    return response.data;
}