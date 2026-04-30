import { Link, useLocation } from 'react-router-dom';

import { navigationItems } from '../model/config';

export const Navigation = () => {
    const location = useLocation();

    // Функция для определения активного состояния
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
            <div className="app-shell-container flex items-center justify-around">
                {navigationItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <div key={item.id} className="flex min-h-[64px] flex-1 flex-col items-center justify-center">
                            <Link
                                to={item.path}
                                className={`flex flex-col items-center p-4 text-center text-wrap transition-colors duration-200 ${active
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
            </div>
        </footer>
    );
};
