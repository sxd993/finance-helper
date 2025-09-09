import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  const now = new Date();

  // Сегодня
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  }

  // Вчера
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Вчера';
  }

  // Иначе
  return format(date, 'dd.MM.yyyy');
};
