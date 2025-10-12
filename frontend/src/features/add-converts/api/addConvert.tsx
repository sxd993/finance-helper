import { client } from '@/shared/api/client';
import type { addConvertPayload } from '../model/types/addConvertPayload.type';

export const addConvert = async (payload: addConvertPayload) => {
    const response = await client.post('/converts/add-convert', {
        convert: payload,
    });
    return response.data;
};


