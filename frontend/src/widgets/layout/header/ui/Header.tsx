import { CalendarIcon, ArrowLeft, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@/entities/user";
import { currentDay, currentDate } from "../model/const";

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton =
    location.pathname.startsWith("/converts/") ||
    location.pathname.startsWith("/transactions/") ||
    location.pathname.startsWith("/settings/");

  const isEditConvertPage = location.pathname.startsWith("/converts/edit/");
  const getTitle = location.pathname.includes()

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="mx-auto max-w-3xl p-5 flex items-center w-full">
        {showBackButton && (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate(-1)}
              aria-label="Назад"
              className="items-center gap-2 px-3 py-1.5 rounded-2xl text-slate-700 text-sm hover:bg-slate-200 active:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ArrowLeft size={24} />
            </button>
            {isEditConvertPage && (
              <h1 className="text-base font-semibold text-slate-900">Настройка категории {}</h1>
            )}
          </div>
        )}

        {!showBackButton && (
          <div className="flex items-center justify-between w-full">
          {/* Левая часть: информация */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <h1 className="text-lg font-bold text-gray-900">Привет,</h1>
                <span className="text-lg font-bold text-primary">
                  {user?.name || "Пользователь"}!
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon size={14} className="text-blue-500" />
                <p>
                  {currentDay}, {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Правая часть: аватар */}
          <div className=" rounded-md  flex items-center justify-center">
            {<Settings width={30} height={30} />}
          </div>
          </div>
        )}
      </div>
    </header>
  );
};
