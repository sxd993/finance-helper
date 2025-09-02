import { useAuth } from '../features/auth/hooks/useAuth';
import { useBalance } from '../features/home/hooks/useBalance';
import { UserBalance } from '../features/home/components/UserBalance';
import { UserInfo } from '../features/home/components/UserInfo';
import { useExpenseByCategory } from '../features/home/hooks/useExpenseByCategory';
import { ExpensesByCategory } from '../features/home/components/ExpensesByCategory';


export const HomePage = () => {
  const { user } = useAuth();
  const { balanceData } = useBalance();
  const {Expenses} = useExpenseByCategory()

  console.log(balanceData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col items-center pt-6 gap-6 w-full pb-8">

        {/* Карточка Пользователя */}
        <UserInfo user={user}/>

        {/* Карточка баланса */}
        <UserBalance balanceData={balanceData}/>

        {/* Траты по категориям */}
        <ExpensesByCategory Expenses={Expenses}/>
      </div>
    </div>
  )
}