import type { Convert } from '../types/types';
import { mockConverts } from '../../mock/converts';

// Простая задержка для имитации сети
const delay = () => new Promise(resolve => setTimeout(resolve, 500));

// Хранилище для изменений
let converts = [...mockConverts];

// Получить все конверты
export const getConverts = async (): Promise<Convert[]> => {
    await delay();
    return converts;
};