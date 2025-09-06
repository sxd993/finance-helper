import type { Transaction } from "../shared/types/types";

export const mockLastTransactions: Transaction[] = [
    {
        id: 1,
        transactions_category: "necessary",
        transactions_subcategory: "Продукты",
        transactions_name: "Покупка в магазине Магнит",
        transactions_amount: 250,
        transactions_date: "2025-09-06T14:30:00",
    },
    {
        id: 2,
        transactions_category: "desire",
        transactions_subcategory: "Развлечения",
        transactions_name: "Билет в кино",
        transactions_amount: 600,
        transactions_date: "2025-09-06T10:15:00",
    },
    {
        id: 3,
        transactions_category: "saving",
        transactions_subcategory: "Отпуск",
        transactions_name: "Перевод на накопительный счёт",
        transactions_amount: 5000,
        transactions_date: "05.09.2025",
    },
    {
        id: 4,
        transactions_category: "investment",
        transactions_subcategory: "Акции",
        transactions_name: "Покупка акций Apple",
        transactions_amount: 12000,
        transactions_date: "04.09.2025",
    },
    {
        id: 5,
        transactions_category: "necessary",
        transactions_subcategory: "Транспорт",
        transactions_name: "Пополнение транспортной карты",
        transactions_amount: 1000,
        transactions_date: "08.08.2025",
    },
];
