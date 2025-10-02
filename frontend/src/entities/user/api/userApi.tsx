import type { User } from "../model/types";
import { client } from "@/shared/api/client";

export const UserApi = async () => {
    const response = await client.get<User>('/auth/check');
    return response.data;
}