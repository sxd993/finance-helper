import type { Convert } from '@shared/types/types';

export type ConvertStatus = {
  progress: number;
  remaining: number;
  statusText: string;
  statusType: 'goalComplete' | 'envelopeEmpty' | 'critical' | 'motivated' | 'normal';
};

// Подбор статуса для отображения прогресса по конверту
export function getConvertStatus(convert: Convert): ConvertStatus {
  const isSaving = convert.convert_type === 'saving';
  const target = isSaving
    ? convert.target_amount ?? convert.limit_amount ?? 0
    : convert.limit_amount ?? convert.target_amount ?? 0;
  const current = convert.current_amount;
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);

  if (isSaving) {
    if (convert.is_complete || progress >= 100) {
      return {
        progress: 100,
        remaining: 0,
        statusType: 'goalComplete',
        statusText: 'Цель достигнута!',
      };
    }

    if (progress >= 85) {
      return {
        progress,
        remaining,
        statusType: 'motivated',
        statusText: 'Почти у цели!',
      };
    }

    if (progress >= 70) {
      return {
        progress,
        remaining,
        statusType: 'critical',
        statusText: 'Финишная прямая!',
      };
    }

    return {
      progress,
      remaining,
      statusType: 'normal',
      statusText: 'Копим дальше',
    };
  }

  if (target === 0) {
    return {
      progress: 0,
      remaining: 0,
      statusType: 'normal',
      statusText: 'Без лимита',
    };
  }

  if (progress >= 100) {
    return {
      progress,
      remaining: 0,
      statusType: 'envelopeEmpty',
      statusText: 'Бюджет исчерпан!',
    };
  }

  if (progress >= 70) {
    return {
      progress,
      remaining,
      statusType: 'critical',
      statusText: 'Осторожно с тратами!',
    };
  }

  return {
    progress,
    remaining,
    statusType: 'normal',
    statusText: 'Все под контролем',
  };
}
