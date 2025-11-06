import { client } from '@/shared/api/client';
import type { CreateConvertPayload } from '../model/types';
import type { CreateConvertResponse } from '../model/types';



export const CreateConvert = async (payload: CreateConvertPayload): Promise<CreateConvertResponse> => {
  const response = await client.post('/converts/add-convert', {
    convert: payload,
  });
  return response.data;
};

