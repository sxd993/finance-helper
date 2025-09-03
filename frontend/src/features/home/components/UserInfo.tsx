import type { User } from "../../../types/types"
import { PageTitle } from "../../../ui/PageTitle";
import { HomeIcon } from "../ui/HomeIcon";

interface UserInfoProps {
    user: User | undefined;
}

export const UserInfo = ({user}:UserInfoProps) => {
    return (
      <>
        <PageTitle title="Профиль" icon={<HomeIcon/>} isButton={false}/>
        <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              Добро пожаловать, <span className="text-orange-600">{user?.name || 'Пользователь'}</span>!
            </p>
          </div>
        </div>
              </>
    )
}