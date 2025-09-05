import { ConvertSection } from '../features/home/components/ConvertSection';
import { BalanceSection } from '../features/home/components/BalanceSection';


export const HomePage = () => {
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col gap-6 pt-4 p-auto">
        <BalanceSection />
        <ConvertSection />
      </div>
    </div>
  );
}