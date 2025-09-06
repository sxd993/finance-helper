import type { Convert, ConvertsInfo } from '../types/types';
import { client } from './client';

// Получить все конверты
export const getConverts = async (): Promise<Convert[]> => {
    const response = await client.get('/converts/converts');
    return response.data;
};

// Получить информацию о недельном бюджете
export const getConvertsInfo = async (): Promise<ConvertsInfo> => {
    const response = await client.get('/converts/converts-info');
    return response.data;
};