import { BalanceCard, LastFiveTransactions, NeedAttentionConverts } from '@features/home';
import { useConverts, useConvertsInfo } from '@entities/convert/model/hooks';
import { useLastTransactions } from '@entities/transaction/model/hooks';

export const HomePage = () => {
  const { converts } = useConverts();
  const { converts_info, isConvertsInfoLoading } = useConvertsInfo();
  const { last_transactions, isLastTransactionsLoading } = useLastTransactions();

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
        <BalanceCard info={converts_info} />
        <NeedAttentionConverts converts={converts} />
        <LastFiveTransactions last_transactions={last_transactions} />
      </div>
    </div>
  );
};
