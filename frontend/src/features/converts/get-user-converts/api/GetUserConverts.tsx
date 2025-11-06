import { client } from '@/shared/api/client';
import type { Convert } from '@/entities/convert';

export const GetUserConverts = async (): Promise<Convert[]> => {
    const response = await client.get('/converts/get-converts');
    return response.data;
};