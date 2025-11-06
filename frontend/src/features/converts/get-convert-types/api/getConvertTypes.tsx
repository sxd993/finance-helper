import { client } from '@/shared/api/client';

export const GetConvertTypes = async () => {
    const response = await client.get('/converts/types');
    return response.data
};