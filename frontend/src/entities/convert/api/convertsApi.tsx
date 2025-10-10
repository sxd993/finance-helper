import { client } from '@/shared/api/client';

import type {
  Convert,
  ConvertType,
  CreateConvertPayload,
} from '@entities/convert/model/types';

export const getConverts = async (): Promise<Convert[]> => {
  const response = await client.get('/converts/get-converts');
  return response.data;
};


export const getConvertTypes = async (): Promise<ConvertType[]> => {
  const response = await client.get<ConvertType[]>('/converts/types');
  return response.data
};

export const createConvert = async (payload: CreateConvertPayload) => {
  const response = await client.post('/converts/add-convert', {
    convert: payload,
  });

  return response.data;
};
