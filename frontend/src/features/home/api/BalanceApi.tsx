import { client } from "../../../shared/api/client";

export const getBalance = async () => {
  const response = await client.get("/dashboard/get-balance");
  return response.data;
};