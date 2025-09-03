import { useAuth } from '../features/auth/hooks/useAuth';
import { UserBalance } from '../features/home/components/UserBalance';
import { UserInfo } from '../features/home/components/UserInfo';


export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col items-center pt-6 gap-6 w-full pb-8">

        {/* Карточка Пользователя */}
        <UserInfo user={user}/>

        {/* Карточка баланса */}
        <UserBalance monthly_income={user?.monthly_income}/>

      </div>
    </div>
  )
}