export const formatConvertsDate = (date: string) => {
  if (!date) return ""; // на случай пустой строки

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date; // если формат странный — возвращаем как есть

  return `${day}.${month}.${year}`;
};
