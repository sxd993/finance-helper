import type { User } from "../../../types/types"

interface UserInfoProps {
    user: User | undefined;
}

export const UserInfo = ({user}:UserInfoProps) => {
    return (
        <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Главная</h1>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              Добро пожаловать, <span className="text-orange-600">{user?.name || 'Пользователь'}</span>!
            </p>
          </div>
        </div>
    )
}