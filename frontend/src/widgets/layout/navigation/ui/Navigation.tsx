import { Link, useLocation } from 'react-router-dom';

import { navigationItems } from '../model/config';

export const Navigation = () => {
    const location = useLocation();

    // Функция для определения активного состояния
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <footer className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 shadow-lg z-50 max-w-3xl mx-auto">
            {navigationItems.map((item) => {
                const active = isActive(item.path);

                return (
                    <div key={item.id} className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                        <Link
                            to={item.path}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${active
                                ? 'text-secondary'
                                : 'text-gray-500 hover:text-secondary'
                                }`}
                        >
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    </div>
                );
            })}
        </footer>
    );
};