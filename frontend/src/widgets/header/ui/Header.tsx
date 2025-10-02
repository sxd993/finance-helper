import { CalendarIcon, UserIcon } from 'lucide-react';

import type { User } from '@shared/types/types';

interface HeaderProps {
  user: User | null;
}

const now = new Date();
const dayNames = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];
const monthNames = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const currentDay = dayNames[now.getDay()];
const currentDate = `${now.getDate()} ${monthNames[now.getMonth()]}`;

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="flex justify-baseline items-center p-4">
      {/* Левая часть */}
      <div className="flex items-center gap-4">
        {/* Аватарка */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
          {user?.name ? user.name[0].toUpperCase() : <UserIcon size={20} />}
        </div>

        {/* Текст */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <h1 className="text-lg font-bold text-gray-900">Привет,</h1>
            <span className="text-lg font-bold text-orange-500">
              {user?.name || 'Пользователь'}!
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon size={14} className="text-blue-500" />
            <p>{currentDay}, {currentDate}</p>
          </div>
        </div>
      </div>
    </header>
  );
};