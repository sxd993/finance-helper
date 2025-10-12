import { client } from '@/shared/api/client';
import type { ConvertType } from '../model/types';

export const getConvertTypes = async (): Promise<ConvertType[]> => {
    const response = await client.get<ConvertType[]>('/converts/types');
    return response.data
};