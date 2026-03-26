import { client } from "@/shared/api/client";
import type { EditConvertPayload, EditConvertResponse } from "../model/types";

export const EditConvert = async (payload: EditConvertPayload): Promise<EditConvertResponse> => {
  const { id } = payload;
  const typeCode = payload.type_code;
  const convert: Record<string, unknown> = {
    name: payload.name,
    type_code: typeCode,
    is_active: payload.is_active,
  };

  if (typeCode === "important" || typeCode === "wishes") {
    convert.monthly_limit = payload.monthly_limit ?? payload.target_amount ?? 0;
    convert.funded_amount = payload.funded_amount ?? payload.initial_amount ?? convert.monthly_limit;
  } else if (typeCode === "saving") {
    convert.goal_amount = payload.goal_amount ?? payload.target_amount ?? 0;
    convert.saved_amount = payload.saved_amount ?? payload.initial_amount ?? 0;
  } else if (typeCode === "investment") {
    convert.invested_amount = payload.invested_amount ?? payload.initial_amount ?? 0;
    convert.current_value = payload.current_value ?? payload.target_amount ?? convert.invested_amount;
  }

  const response = await client.patch(`/converts/edit-convert/${id}`, {
    convert,
  });

  return response.data;
};
