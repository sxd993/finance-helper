import { client } from '@shared/api/client';
import type { User } from '@shared/types/types';

interface LoginData {
    login: string;
    password: string;
}

interface RegisterData {
    login: string;
    name: string;
    password: string;
}

export const AuthApi = {
    // Вход пользователя
    login: async (data: LoginData): Promise<User> => {
        const response = await client.post("/auth/login", data);
        return response.data;
    },
    // Регистрация нового пользователя
    register: async (data: RegisterData): Promise<User> => {
        const response = await client.post("/auth/register", data);
        return response.data;
    },
    // Проверка авторизации
    checkAuth: async (): Promise<User> => {
        const response = await client.get<User>('/auth/check');
        return response.data;
    },
    logout: async (): Promise<void> => {
        await client.post('/auth/logout');
    }
}