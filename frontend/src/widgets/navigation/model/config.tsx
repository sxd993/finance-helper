import type { JSX } from 'react';
import { Home, Mail, Wallet } from 'lucide-react';

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
        id: 'expenses',
        path: '/expenses',
        label: 'Траты',
        icon: <Wallet className="w-6 h-6 mb-1" />,
    },
    {
        id: 'converts',
        path: '/converts',
        label: 'Конверты',
        icon: <Mail className="w-6 h-6 mb-1" />,
    },

];