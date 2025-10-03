import { BalanceCard, LastFiveTransactions } from '@widgets/dashboard/index';
import { useLastTransactions } from '@entities/transaction/model/hooks';
import { useUser } from '@/entities/user';

const calcWeeklyLimit = (monthlyIncome?: number | null) => {
  if (!monthlyIncome) {
    return 0;
  }
  return Math.round((monthlyIncome / 4) * 100) / 100;
};

export const HomePage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { last_transactions, isLastTransactionsLoading } = useLastTransactions();

  const weeklyLimit = calcWeeklyLimit(user?.monthly_income);
  const isLoading = isUserLoading || isLastTransactionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col gap-6 pt-4">
        <BalanceCard weeklyLimit={weeklyLimit} />
        <LastFiveTransactions last_transactions={last_transactions} />
      </div>
    </div>
  );
};
