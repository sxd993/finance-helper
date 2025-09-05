import type { User } from "../types/types";
import { mockUser } from "../../mock/user";

// Простая задержка для имитации сети
const delay = () => new Promise(resolve => setTimeout(resolve, 500));

// Получить данные пользователя
export const getUser = async (): Promise<User> => {
    await delay();
    return mockUser;
};