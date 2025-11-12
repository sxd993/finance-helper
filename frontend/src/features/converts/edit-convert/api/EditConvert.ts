import { client } from "@/shared/api/client";
import type { EditConvertPayload, EditConvertResponse } from "../model/types";

export const EditConvert = async (payload: EditConvertPayload): Promise<EditConvertResponse> => {
  const { id, ...convert } = payload;
  const response = await client.patch(`/converts/edit-convert/${id}`, {
    convert,
  });

  return response.data;
};
