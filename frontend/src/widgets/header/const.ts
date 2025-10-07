const now = new Date();
const dayNames = [
    "Воскресенье", "Понедельник", "Вторник", "Среда",
    "Четверг", "Пятница", "Суббота",
];
const monthNames = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export const currentDay = dayNames[now.getDay()];
export const currentDate = `${now.getDate()} ${monthNames[now.getMonth()]}`;