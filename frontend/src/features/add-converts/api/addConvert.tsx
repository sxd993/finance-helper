import { client } from '@/shared/api/client';
import type { CreateConvertPayload } from '../model/types/addConvertPayload.type';

export const addConvert = async (payload: CreateConvertPayload) => {
    const response = await client.post('/converts/add-convert', {
        convert: payload,
    });
    return response.data;
};

