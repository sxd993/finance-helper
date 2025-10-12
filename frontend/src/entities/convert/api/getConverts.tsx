import { client } from '@/shared/api/client';
import type { Convert } from '../model/types';

export const getConverts = async (): Promise<Convert[]> => {
    const response = await client.get('/converts/get-converts');
    return response.data;
};