import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, WalletIcon, EnvelopeIcon } from './icons/IconComponents';

interface NavigationItem {
    id: string;
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Конфигурация навигации
const navigationItems: NavigationItem[] = [
    {
        id: 'home',
        path: '/home',
        label: 'Главная',
        icon: HomeIcon,
    },
    {
        id: 'expenses',
        path: '/expenses',
        label: 'Траты',
        icon: WalletIcon,
    },
    {
        id: 'envelopes',
        path: '/envelopes',
        label: 'Конверты',
        icon: EnvelopeIcon,
    },

];

export const Navigation: React.FC = () => {
    const location = useLocation();

    // Функция для определения активного состояния
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 shadow-lg z-50">
            {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);

                return (
                    <div key={item.id} className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                        <Link
                            to={item.path}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${active
                                    ? 'text-orange-500 bg-orange-50'
                                    : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                                }`}
                        >
                            <IconComponent className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
};