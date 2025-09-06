import { BalanceCard } from "../features/home/ui/BalanceCard";
import { HomeHeader } from "../features/home/ui/HomeHeader";
import { LastFiveTransactions } from "../features/home/ui/LastFiveTransactions";
import { NeedAttentionConverts } from "../features/home/ui/NeedAttentionConverts";
import { useMockConverts, useMockConvertsInfo } from "../shared/hooks/useMockConverts";
import { useMockLastTransactions } from "../shared/hooks/useMockLastTransactions";
import { useMockUser } from "../shared/hooks/useMockUser";


export const HomePage = () => {
  const { user, isUserLoading } = useMockUser();
  const { converts } = useMockConverts();
  const { converts_info, isConvertsInfoLoading } = useMockConvertsInfo();
  const { last_transactions, isLastTransactionsLoading } = useMockLastTransactions();


  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (isConvertsInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (isLastTransactionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col gap-6 pt-4">
        <HomeHeader user={user} />
        <BalanceCard info={converts_info} />
        <NeedAttentionConverts converts={converts} />
        <LastFiveTransactions last_transactions={last_transactions} />
      </div>
    </div>
  );
}