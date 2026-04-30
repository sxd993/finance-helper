import type { JSX } from 'react';
import { Home, Coins, History, Settings } from 'lucide-react';

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
        id: 'history',
        path: '/history',
        label: 'История',
        icon: <History className="w-6 h-6 mb-1" />,
    },
    {
        id: 'remainders',
        path: '/remainders',
        label: 'Остатки',
        icon: <Coins className="w-6 h-6 mb-1" />,
    },
    {
        id: 'settings',
        path: '/settings',
        label: 'Настройки',
        icon: <Settings className="w-6 h-6 mb-1" />,
    },
];
