import { WarningIcon } from './icons/IconComponents';

interface EnvelopeCardProps {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    spent: number;
    remaining: number;
    goal: number;
    daysLeft: number;
    isOverBudget?: boolean;
    showCautionMessage?: boolean;
    cautionMessage?: string;
    isGoal?: boolean;
    progress?: number;
    monthlyTransfer?: number;
    isCompleted?: boolean;
    weeklyLimit?: number;
}

export function EnvelopeCard({
    name,
    icon: Icon,
    iconColor,
    spent,
    remaining,
    goal,
    daysLeft,
    isOverBudget,
    showCautionMessage,
    cautionMessage,
    isGoal,
    progress,
    monthlyTransfer,
    isCompleted,
    weeklyLimit
}: EnvelopeCardProps) {
    const progressPercent = Math.round((spent / goal) * 100);
    const displayPercent = isGoal ? progress || progressPercent : progressPercent;

    const getProgressColor = () => {
        if (isCompleted) return 'bg-green-500';
        if (isOverBudget || progressPercent >= 100) return 'bg-red-500';
        if (progressPercent >= 80) return 'bg-orange-500';
        if (isGoal && progress && progress > 90) return 'bg-green-500';
        return 'bg-gray-400';
    };

    return (
        <div className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="">{name}</div>
                        {monthlyTransfer && (
                            <div className="text-xs text-gray-500">
                                {monthlyTransfer.toLocaleString('ru-RU')} ₽/мес
                            </div>
                        )}
                        {weeklyLimit && !isGoal && (
                            <div className="text-xs text-blue-600">
                                Лимит: {weeklyLimit.toLocaleString('ru-RU')} ₽/нед
                            </div>
                        )}
                    </div>
                </div>

                {(isOverBudget || showCautionMessage) && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <WarningIcon className="w-4 h-4" />
                        <span>{cautionMessage || "Бюджет исчерпан!"}</span>
                    </div>
                )}

                {isGoal && isCompleted && (
                    <div className="text-green-600 text-sm flex items-center space-x-1">
                        <span>✓ Почти готово! 🎉</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between mb-4">
                <div>
                    <div className="text-sm text-gray-500">{isGoal ? "Накоплено" : "Потрачено"}</div>
                    <div className="">{spent.toLocaleString('ru-RU')} ₽</div>
                </div>

                <div className="text-right">
                    <div className="text-sm text-gray-500">{isGoal ? "До цели" : "Остаток"}</div>
                    <div className={remaining <= 0 && !isGoal ? "text-red-600" : ""}>
                        {remaining.toLocaleString('ru-RU')} ₽
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{isGoal ? "Прогресс к цели" : "Использовано бюджета"}</span>
                    <span>{displayPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                        style={{ width: `${Math.min(displayPercent, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Цель: {goal.toLocaleString('ru-RU')} ₽</span>
                    <span>{daysLeft} дн.</span>
                </div>
            </div>
        </div>
    );
}