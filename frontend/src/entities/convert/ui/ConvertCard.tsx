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
  const { balance, limit, spent, percentage, goal_percentage, remaining_to_goal, returnPercentage, absoluteReturn, isProfit, isLoss } = computeConvertMetrics(convert);

  switch (convert.type.code) {
    case 'important':
      return (
        <ImportantConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentage}
        />
      )

    case 'wishes':
      return (
        <WishesConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentage}
        />
      )

    case 'saving':
      return (
        <SavingConvertCard
          convert={convert}
          balance={balance}
          goal_percentage={goal_percentage}
          remaining_to_goal={remaining_to_goal}
        />
      )

    case "investment":
      return (
        <InvestmentConvertCard
          convert={convert}
          balance={balance}
          returnPercentage={returnPercentage}
          absoluteReturn={absoluteReturn}
          isProfit={isProfit}
          isLoss={isLoss}
        />
      )
  }
};
