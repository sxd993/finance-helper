export const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
};

export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
};

export const getRemainingAmount = (current: number, target: number) => {
    return Math.max(target - current, 0);
};