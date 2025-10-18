import type { JSX } from 'react';
import { Home, Mail, Coins, BanknoteArrowDown, User2 } from 'lucide-react';

interface NavigationItem {
    id: string;
    path: string;
    label: string;
    icon: JSX.Element;
}

// Конфигурация навигации
export const navigationItems: NavigationItem[] = [
    {
        id: 'home',
        path: '/home',
        label: 'Главная',
        icon: <Home className="w-6 h-6 mb-1" />,
    },
    {
        id: 'converts',
        path: '/converts',
        label: 'Конверты',
        icon: <Mail className="w-6 h-6 mb-1" />,
    },
    {
        id: 'expenses',
        path: '/expenses',
        label: 'Расходы',
        icon: <BanknoteArrowDown className="w-6 h-6 mb-1" />,
    },
    {
        id: 'remainders',
        path: '/remainders',
        label: 'Остатки',
        icon: <Coins className="w-6 h-6 mb-1" />,
    },
    {
        id: 'profile',
        path: '/profile',
        label: 'Профиль',
        icon: <User2 className="w-6 h-6 mb-1" />,
    },
];