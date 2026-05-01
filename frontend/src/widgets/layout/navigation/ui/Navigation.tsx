import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { navigationItems } from '../model/config';

export const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Функция для определения активного состояния
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <>
            <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
                <div className="app-shell-container grid grid-cols-5 items-center">
                    {navigationItems.map((item, index) => {
                        const active = isActive(item.path);

                        return (
                            <div key={item.id} className="contents">
                                {index === 2 && (
                                    <div className="flex min-h-[64px] items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/operations')}
                                            aria-label="Добавить операцию"
                                            className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-secondary text-white shadow-lg ring-4 ring-white transition hover:bg-secondary-dark"
                                        >
                                            <Plus className="h-7 w-7" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex min-h-[64px] flex-col items-center justify-center">
                                    <Link
                                        to={item.path}
                                        className={`flex flex-col items-center p-2 text-center text-wrap transition-colors duration-200 ${active
                                            ? 'text-secondary'
                                            : 'text-gray-500 hover:text-secondary'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </footer>
        </>
    );
};
