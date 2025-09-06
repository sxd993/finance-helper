import { mockLastTransactions } from "../../mock/transactions";

// Простая задержка для имитации сети
const delay = () => new Promise(resolve => setTimeout(resolve, 500));


export const getLastTransactions = async () => {
    await delay()
    return mockLastTransactions
}