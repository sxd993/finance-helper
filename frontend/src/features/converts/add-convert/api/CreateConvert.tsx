import { client } from '@/shared/api/client';
import type { CreateConvertPayload } from '../model/types';
import type { CreateConvertResponse } from '../model/types';



export const CreateConvert = async (payload: CreateConvertPayload): Promise<CreateConvertResponse> => {
  const typeCode = payload.type_code;
  const mapped: Record<string, unknown> = {
    name: payload.name,
    type_code: typeCode,
    is_active: payload.is_active,
  };

  if (typeCode === "important" || typeCode === "wishes") {
    mapped.monthly_limit = payload.monthly_limit ?? payload.target_amount ?? 0;
    mapped.funded_amount = payload.funded_amount ?? payload.initial_amount ?? mapped.monthly_limit;
  } else if (typeCode === "saving") {
    mapped.goal_amount = payload.goal_amount ?? payload.target_amount ?? 0;
    mapped.saved_amount = payload.saved_amount ?? payload.initial_amount ?? 0;
  } else if (typeCode === "investment") {
    mapped.invested_amount = payload.invested_amount ?? payload.initial_amount ?? 0;
    mapped.current_value = payload.current_value ?? payload.target_amount ?? mapped.invested_amount;
  }

  const response = await client.post('/converts/add-convert', {
    convert: mapped,
  });
  return response.data;
};

