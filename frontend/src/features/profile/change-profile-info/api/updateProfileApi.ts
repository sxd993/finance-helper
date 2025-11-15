import type { User } from "@/entities/user";
import { client } from "@/shared/api/client";
import type { ProfileFormValues } from "../model/types";


export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export const updateProfileApi = async (payload: ProfileFormValues) => {
  const response = await client.patch<UpdateProfileResponse>("/settings/profile", payload);
  return response.data;
};

