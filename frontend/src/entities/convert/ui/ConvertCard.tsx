import type { Convert } from '../model/types';
import { getConvertMetrics } from '@/entities/convert/lib/getConvertMetrics';
import { ImportantConvertCard } from './cards/ImportantConvertCard';
import { WishesConvertCard } from './cards/WishesConvertCard';
import { SavingConvertCard } from './cards/SavingConvertCard';
import { InvestmentConvertCard } from './cards/InvestmentConvertCard';

type ConvertCardProps = {
  convert: Convert;
};


export const ConvertCard = ({ convert }: ConvertCardProps) => {
  const metrics = getConvertMetrics(convert);
  const {
    balance,
    limit,
    spent,
    percentage,
    goalPercentage,
    remainingToGoal,
    investment,
  } = metrics;
  const typeCode = convert.type?.code ?? convert.type_code;

  switch (typeCode) {
    case 'important':
      return (
        <ImportantConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentage}
        />
      );

    case 'wishes':
      return (
        <WishesConvertCard
          convert={convert}
          balance={balance}
          limit={limit}
          spent={spent}
          percentage={percentage}
        />
      );

    case 'saving':
      return (
        <SavingConvertCard
          convert={convert}
          balance={balance}
          goal_percentage={goalPercentage}
          remaining_to_goal={remainingToGoal}
        />
      );

    case 'investment':
      return (
        <InvestmentConvertCard
          convert={convert}
          currentValue={investment.currentValue}
          initialValue={investment.initialValue}
          returnPercentage={investment.returnPercentage}
          absoluteReturn={investment.absoluteReturn}
          isProfit={investment.isProfit}
          isLoss={investment.isLoss}
        />
      );
  }

  return null;
};
