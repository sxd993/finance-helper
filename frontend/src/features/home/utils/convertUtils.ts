import type { Convert } from '../types';

export type ConvertStatus = {
    progress: number;
    remaining: number;
    statusText: string;
    statusType: 'goalComplete' | 'envelopeEmpty' | 'critical' | 'motivated' | 'normal';
};

export function getConvertStatus(convert: Convert): ConvertStatus {
    const isGoal = convert.account_id === 2;
    const progress = Math.min((convert.current / convert.target) * 100, 100);
    
    if (isGoal) {
        // ЦЕЛИ - хорошо когда накопили много
        const remaining = Math.max(convert.target - convert.current, 0);
        const completionRate = convert.current / convert.target;
        
        if (convert.isComplete || completionRate >= 1) {
            return {
                progress: 100,
                remaining: 0,
                statusType: 'goalComplete',
                statusText: 'Цель достигнута!'
            };
        }
        
        if (completionRate >= 0.85) {
            return {
                progress,
                remaining,
                statusType: 'motivated',
                statusText: 'Почти у цели!'
            };
        }
        
        if (completionRate >= 0.7) {
            return {
                progress,
                remaining,
                statusType: 'critical', 
                statusText: 'Финишная прямая!'
            };
        }
        
        return {
            progress,
            remaining,
            statusType: 'normal',
            statusText: 'Копим дальше'
        };
        
    } else {
        // КОНВЕРТЫ - плохо когда потратили много
        const remaining = Math.max(convert.target - convert.current, 0);
        const spentRate = convert.current / convert.target;
        
        if (spentRate >= 1) {
            return {
                progress,
                remaining: 0,
                statusType: 'envelopeEmpty',
                statusText: 'Бюджет исчерпан!'
            };
        }
        
        if (spentRate >= 0.7) {  // Потратили 80%+
            return {
                progress,
                remaining,
                statusType: 'critical',
                statusText: 'Осторожно с тратами!'
            };
        }
        
        return {
            progress,
            remaining,
            statusType: 'normal',
            statusText: 'Все под контролем'
        };
    }
}