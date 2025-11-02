import { Heart, Star, Target, HandCoins } from 'lucide-react';

export const renderConvertIcon = (code?: string) => {
    if (!code) return null;
    switch (code) {
        case 'important':
            return <Heart className="w-6 h-6 text-orange-500" />;
        case 'wishes':
            return <Star className="w-6 h-6 text-yellow-500" />;
        case 'saving':
            return <Target className="w-6 h-6 text-green-600" />;
        case 'investment':
            return <HandCoins className='w-6 h-6 text-primary' />
        default:
            return null;
    }
}
