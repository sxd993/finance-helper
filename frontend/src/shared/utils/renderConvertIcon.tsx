import { Heart, Star, Target, HandCoins } from 'lucide-react';
import { getConvertTypePalette } from '@/entities/convert';

export const renderConvertIcon = (code?: string) => {
    if (!code) return null;
    const palette = getConvertTypePalette(code);
    switch (code) {
        case 'important':
            return <Heart className={`w-6 h-6 ${palette.text}`} />;
        case 'wishes':
            return <Star className={`w-6 h-6 ${palette.text}`} />;
        case 'saving':
            return <Target className={`w-6 h-6 ${palette.text}`} />;
        case 'investment':
            return <HandCoins className={`w-6 h-6 ${palette.text}`} />
        default:
            return null;
    }
}
