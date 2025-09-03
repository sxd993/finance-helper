import { useAuth } from '../features/auth/hooks/useAuth';
import { ConvertSection } from '../features/home/components/ConvertSection';
import { BalanceSection } from '../features/home/components/BalanceSection';
import { PageTitle } from '../ui/PageTitle';
import { HomeIcon } from '../ui/icons/HomeIcon';


export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <PageTitle title='Главная' icon={<HomeIcon />} />
      </div>
      <div className="flex flex-col gap-6 pt-4 px-5">
        <BalanceSection />
        <ConvertSection />
      </div>
    </div>
  );
};