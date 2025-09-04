import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
    const location = useLocation();
    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <nav className='fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 shadow-lg z-50'>
            {/* Главная */}
            <div className="flex flex-col items-center justify-center flex-1 h-full">
                <Link
                    to="/home"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${isActive('/home')
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <span className="text-xs font-medium">Главная</span>
                </Link>
            </div>

            {/* Транзакции */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                <Link
                    to="/transactions"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${isActive('/transactions')
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                    <span className="text-xs font-medium">Траты</span>
                </Link>
            </div>

            {/* Цели */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                <Link
                    to="/goals"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${isActive('/goals')
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                        }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                    </svg>
                    <span className="text-xs font-medium">Цели</span>
                </Link>
            </div>
            {/* Конверты */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                <Link
                    to="/converts"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${isActive('/converts')
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote-icon lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                    <span className="text-xs font-medium">Конверты</span>
                </Link>
            </div>
        </nav>
    );
};