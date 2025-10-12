import { CalendarIcon, UserIcon, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@shared/types/types";
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

  return (
    <header className={`flex justify-start items-center max-w-3xl mx-auto border-b border-slate-200 pb-5`}>
      <div>
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Назад"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <ArrowLeft size={16} />
            <span>Назад</span>
          </button>
        )}
      </div>

      {!showBackButton && (
        <div className="flex items-center gap-4">
          {/* Аватарка */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
            {user?.name ? user.name[0].toUpperCase() : <UserIcon size={20} />}
          </div>

          {/* Текст */}
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
      )}
    </header>
  );
};
