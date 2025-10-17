import type { Convert } from '../model/types';
import { computeConvertMetrics } from '@/shared/utils/convertMetrics';
import { ImportantConvertCard } from './cards/ImportantConvertCard';
import { WishesConvertCard } from './cards/WishesConvertCard';
import { SavingConvertCard } from './cards/SavingConvertCard';
import { InvestmentConvertCard } from './cards/InvestmentConvertCard';

type ConvertCardProps = {
  convert: Convert;
};


export const ConvertCard = ({ convert }: ConvertCardProps) => {
  const metrics = computeConvertMetrics(convert);
  const {
    balance,
    limit,
    spent,
    percentage,
    goal_percentage,
    remaining_to_goal,
    returnPercentage,
    absoluteReturn,
    isProfit,
    isLoss
  } = metrics;

  const percentValue = percentage();
  const typeCode = convert.type?.code ?? convert.type_code;

  switch (typeCode) {
    case 'important':
      return (
        <ImportantConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentValue}
        />
      );

    case 'wishes':
      return (
        <WishesConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentValue}
        />
      );

    case 'saving':
      return (
        <SavingConvertCard
          convert={convert}
          balance={balance}
          goal_percentage={goal_percentage}
          remaining_to_goal={remaining_to_goal}
        />
      );

    case 'investment':
      return (
        <InvestmentConvertCard
          convert={convert}
          balance={balance}
          returnPercentage={returnPercentage}
          absoluteReturn={absoluteReturn}
          isProfit={isProfit}
          isLoss={isLoss}
        />
      );
  }

  return null;
};
