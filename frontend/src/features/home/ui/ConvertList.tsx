import React from 'react';
import { CheckCircle, AlertTriangle, Flame, Target, Wallet } from 'lucide-react';

interface Convert {
  id: number;
  name: string;
  current: number;
  target: number;
  category: string;
  account_id: number;
  one_transfer?: number;
  daysLeft?: number;
  daysLeftToComplete?: number;
  isComplete?: boolean;
}

interface ConvertListProps {
  converts: Convert[];
  onConvertClick: (convertId: number) => void;
}

type StatusType = 'goalComplete' | 'envelopeEmpty' | 'critical' | 'motivated' | 'normal';

// Конфигурация статусов
const STATUS_CONFIG = {
  goalComplete: {
    icon: CheckCircle,
    textColor: 'text-green-600',
    progressColor: 'bg-green-500',
  },
  envelopeEmpty: {
    icon: AlertTriangle,
    textColor: 'text-red-600',
    progressColor: 'bg-red-500',
  },
  critical: {
    icon: Flame,
    textColor: 'text-red-600',
    progressColor: 'bg-red-400',
  },
  motivated: {
    icon: Target,
    textColor: 'text-orange-600',
    progressColor: 'bg-orange-500',
  },
  normal: {
    icon: Wallet,
    textColor: 'text-gray-900',
    progressColor: 'bg-gray-500',
  },
};

const categoryIcons: Record<string, string> = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  health: '🏥',
  education: '📚',
  home: '🏠',
};

// Функция для получения статуса конверта
function getConvertStatus(convert: Convert) {
  const isGoal = convert.account_id === 2;
  const progress = Math.min((convert.current / convert.target) * 100, 100);
  const remaining = Math.max(convert.target - convert.current, 0);
  const completionRate = convert.current / convert.target;
  
  let statusType: StatusType;
  let statusText: string;
  
  if (isGoal) {
    // ЦЕЛИ - хорошо когда накопили много
    if (convert.isComplete || completionRate >= 1) {
      statusType = 'goalComplete';
      statusText = 'Цель достигнута!';
    } else if (completionRate >= 0.85) {
      statusType = 'motivated';
      statusText = 'Почти у цели!';
    } else if (completionRate >= 0.7) {
      statusType = 'critical'; 
      statusText = 'Финишная прямая!';
    } else {
      statusType = 'normal';
      statusText = 'Копим дальше';
    }
  } else {
    // КОНВЕРТЫ - плохо когда потратили много
    if (completionRate >= 1) {
      statusType = 'envelopeEmpty';
      statusText = 'Бюджет исчерпан!';
    } else if (completionRate >= 0.7) {
      statusType = 'critical';
      statusText = 'Осторожно с тратами!';
    } else {
      statusType = 'normal';
      statusText = 'Все под контролем';
    }
  }
  
  const config = STATUS_CONFIG[statusType];
  
  return {
    progress,
    remaining,
    statusType,
    statusText,
    ...config
  };
}

export const ConvertList: React.FC<ConvertListProps> = ({ converts, onConvertClick }) => {
  return (
    <div className="space-y-3">
      {converts.map((convert) => {
        const status = getConvertStatus(convert);
        const isGoal = convert.account_id === 2;
        const StatusIcon = status.icon;

        return (
          <button
            key={convert.id}
            onClick={() => onConvertClick(convert.id)}
            className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all text-left"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg bg-gray-100">
                  {categoryIcons[convert.category] || '📄'}
                </div>
                <span className="text-sm font-medium text-gray-900">{convert.name}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${status.textColor}`}>
                <StatusIcon className="w-4 h-4" />
                <span>{status.statusText}</span>
              </div>
            </div>

            {/* Суммы */}
            <div className="flex justify-between text-sm mb-2">
              <div>
                <span className="text-gray-500 block">{isGoal ? 'Накоплено' : 'Потрачено'}</span>
                <span className="font-semibold text-gray-900">{convert.current.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">{isGoal ? 'До цели' : 'Остаток'}</span>
                <span className="font-semibold text-gray-900">{status.remaining.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{isGoal ? 'Прогресс к цели' : 'Использовано бюджета'}</span>
                <span>{Math.round(status.progress)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${status.progressColor}`}
                  style={{ width: `${Math.min(status.progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Доп. инфа */}
            <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
              {isGoal ? (
                <span>Перевод: <span className="font-medium">{convert.one_transfer?.toLocaleString('ru-RU')} ₽/мес</span></span>
              ) : (
                <span>Цель: <span className="font-medium">{convert.target.toLocaleString('ru-RU')} ₽</span></span>
              )}
              <span className={`font-medium ${status.textColor}`}>
                {convert?.daysLeft || convert?.daysLeftToComplete} дн.
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};