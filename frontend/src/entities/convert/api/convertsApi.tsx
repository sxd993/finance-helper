import { client } from '@/shared/api/client';

import type {
  Convert,
  ConvertsInfo,
  ConvertType,
  CreateConvertPayload,
} from '@entities/convert/model/types';

export const getConverts = async (): Promise<Convert[]> => {
  const response = await client.get('/converts');
  return response.data;
};

export const getConvertsInfo = async (): Promise<ConvertsInfo> => {
  const response = await client.get('/converts-info');
  return response.data;
};

type ConvertTypeResponse = {
  id: number;
  code: string;
  title: string;
  has_limit: boolean;
  accumulates: boolean;
};

export const getConvertTypes = async (): Promise<ConvertType[]> => {
  const response = await client.get<ConvertTypeResponse[]>('/converts/types');

  return response.data.map((type) => ({
    id: type.id,
    code: type.code,
    title: type.title,
    hasLimit: Boolean(type.has_limit),
    accumulates: Boolean(type.accumulates),
  }));
};

export const createConvert = async (payload: CreateConvertPayload) => {
  const response = await client.post('/add-convert', {
    convert: payload,
  });

  return response.data;
};
