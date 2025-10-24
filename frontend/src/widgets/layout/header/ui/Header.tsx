import { CalendarIcon, ArrowLeft, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@/entities/user";
import { currentDay, currentDate } from "../model/const";
import { useParams } from "react-router-dom";
import { formatTypeCode } from "@/features/add-converts/model/lib/formatTypeCode";
import { RenderConvertIcon } from "@/shared/ui/RenderConvertIcon";
import { useLogout } from "@/features/auth";

interface HeaderProps {
  user: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const { type_code } = useParams<{ type_code: string }>();
  const { handleLogout } = useLogout()
  const location = useLocation();
  const navigate = useNavigate();
  const trimmedName = user?.name?.trim();
  const userInitial = trimmedName ? trimmedName.charAt(0).toUpperCase() : "П";

  const showBackButton =
    location.pathname.startsWith("/converts/") ||
    location.pathname.startsWith("/transactions/") ||
    location.pathname.startsWith("/settings/");

  const isEditConvertPage = location.pathname.startsWith("/converts/edit/");

  return (
    <header className="sticky top-0 z-50 max-w-3xl bg-white border-b border-slate-200 w-full mx-auto">
      <div className="mx-auto w-full p-5 flex items-center">
        {showBackButton && (
          <div className="relative flex items-center w-full justify-center">
            <button
              onClick={() => navigate(-1)}
              aria-label="Назад"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-slate-700 text-sm hover:bg-slate-200 active:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 absolute left-0"
            >
              <ArrowLeft size={24} />
            </button>
            {isEditConvertPage && (
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-base sm:text-lg  text-slate-900">Настройка категории</h1>
                {type_code && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    {RenderConvertIcon(type_code)}
                    <span className="text-sm">{formatTypeCode(type_code)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!showBackButton && (
          <div className="flex items-center justify-between w-full">
            {/* Левая часть: информация */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 text-lg  uppercase text-white"
                aria-label={`Профиль ${trimmedName || "пользователя"}`}
              >
                {userInitial}
              </div>
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
            <button
              onClick={handleLogout}
              className=" rounded-md  flex items-center justify-center">
              {<LogOut width={25} height={25} />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
