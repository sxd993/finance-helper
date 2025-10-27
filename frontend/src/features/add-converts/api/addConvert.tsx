import { client } from '@/shared/api/client';
import type { CreateConvertPayload } from '../model/types/addConvertPayload.type';
import type { CreateConvertResponse } from '../model/types/addConvertResponse.type';

export const addConvert = async (
  payload: CreateConvertPayload,
): Promise<CreateConvertResponse> => {
    const response = await client.post('/converts/add-convert', {
        convert: payload,
    });
    return response.data;
};

