import type { User } from "../../../types/types"
import { PageTitle } from "../../../ui/PageTitle";
import { HomeIcon } from "../ui/HomeIcon";

interface ProfileSectionProps {
    user: User | undefined;
    monthly_income?: number;
}

export const ProfileSection = ({ user, monthly_income }: ProfileSectionProps) => {
    return (
        <section className='flex flex-col items-center pt-6 gap-6 w-full pb-8'>
            {/* Инфа о юзере */}
            <PageTitle title="Профиль" icon={<HomeIcon />} isButton={false} />
            <div className="flex flex-col items-center gap-4 w-[90%] max-w-md">
                <div className="flex flexs-col border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">
                        Добро пожаловать, <span className="text-orange-600">{user?.name || 'Пользователь'}</span>!
                    </p>
                </div>
                <section className="w-full p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex flex-row sm:flex-row sm:iзtems-center sm:justify-between">
                        <h1 className="text-sm font-medium text-gray-500">
                            Ваш заработок в месяц
                        </h1>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {monthly_income?.toLocaleString("ru-RU") || 0} ₽
                        </h2>
                    </div>
                </section>

            </div>

            {/* Инфа о заработке */}
            <div className="flex flex-col items-center gap-2 justify-top mt-6">
                <div className="flex flex-col">

                </div>
            </div>
        </section>
    )
}