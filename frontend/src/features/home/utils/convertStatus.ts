import { CheckCircle, AlertTriangle, Flame, Target, TrendingUp, Wallet } from 'lucide-react';

// Статусы для целей (goal)
export const goalStatuses = () => ({
  goalComplete: {
    icon: CheckCircle,
    textColor: 'text-orange-600',
    progressColor: 'bg-orange-600',
  },
  critical: {
    icon: TrendingUp,
    textColor: 'text-orange-600',
    progressColor: 'bg-orange-500',
  },
  motivated: {
    icon: Target,
    textColor: 'text-orange-600',
    progressColor: 'bg-orange-500',
  },
  default: {
    icon: Wallet,
    textColor: 'text-gray-900',
    progressColor: 'bg-gray-500',
  },
});

// Статусы для обычных конвертов (main)
export const mainStatuses = () => ({
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
    textColor: 'text-orange-400',
    progressColor: 'bg-orange-400',
  },
  default: {
    icon: Wallet,
    textColor: 'text-gray-900',
    progressColor: 'bg-gray-500',
  },
});
