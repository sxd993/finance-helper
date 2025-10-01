import type { User } from '@entities/user/model/types';
import { mockUser } from '@/shared/mock/user';

// Простая задержка для имитации сети
const delay = () => new Promise(resolve => setTimeout(resolve, 500));

// Получить данные пользователя
export const getUser = async (): Promise<User> => {
    await delay();
    return mockUser;
};
