import { useAuth } from '../features/auth/hooks/useAuth';
import { ConvertSection } from '../features/home/components/ConvertSection';
import { BalanceSection } from '../features/home/components/BalanceSection';
import { Header } from '../shared/ui/Header';
import { HomeIcon } from '../shared/ui/icons/IconComponents';


export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <Header
          title='Главная'
          icon={<HomeIcon />}
          showUserName={true}
          userName={user?.name || 'Пользователь'}
        />
      </div>
      <div className="flex flex-col gap-6 pt-4 px-5">
        <BalanceSection />
        <ConvertSection />
      </div>
    </div>
  );
}