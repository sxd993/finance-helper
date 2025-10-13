import { Heart, Star, Target, HandCoins } from 'lucide-react';

export const RenderConvertIcon = (code?: string) => {
    if (!code) return null;
    switch (code) {
        case 'important':
            return <Heart className="w-5 h-5 text-orange-500" />;
        case 'wishes':
            return <Star className="w-5 h-5 text-yellow-500" />;
        case 'saving':
            return <Target className="w-5 h-5 text-green-600" />;
        case 'investment':
            return <HandCoins className='w-5 h-5 text-primary' />
        default:
            return null;
    }
}
