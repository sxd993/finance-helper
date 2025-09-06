import { CalendarIcon } from "lucide-react";
import type { User } from "../../../shared/types/types";
import { Logo } from '../../../shared/ui/Logo'

interface HomeHeaderProps {
  user?: User;
}
// Получаем текущую дату и день недели
const now = new Date();
const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const currentDay = dayNames[now.getDay()];
const currentDate = `${now.getDate()} ${monthNames[now.getMonth()]}`;

export function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <header className="flex justify-between p-2 items-baseline">
      <div className="flex flex-col">
        <h1 className="text-xl text-gray-900">Привет, {user?.name}!</h1>
        <div className="flex gap-2">
          <CalendarIcon />
          <p className="">{currentDay}, {currentDate}</p>
        </div>
      </div>
      <Logo />
    </header>

  );
}
