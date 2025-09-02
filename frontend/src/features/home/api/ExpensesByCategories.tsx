import { client } from "../../../shared/api/client"

export const GetExpensesByCategories = async () => {
  const response = await client.get("/dashboard/get-expenses-by-categories");
  return response.data;
};

