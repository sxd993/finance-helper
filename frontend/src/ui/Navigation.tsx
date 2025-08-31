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
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${
                        isActive('/home') 
                            ? 'text-orange-500 bg-orange-50' 
                            : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                    }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <span className="text-xs font-medium">Главная</span>
                </Link>
            </div>

            {/* Транзакции */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                <Link
                    to="/transactions"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${
                        isActive('/transactions') 
                            ? 'text-orange-500 bg-orange-50' 
                            : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                    }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                    </svg>
                    <span className="text-xs font-medium">Транзакции</span>
                </Link>
            </div>

            {/* Цели */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-[64px]">
                <Link
                    to="/goals"
                    className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${
                        isActive('/goals') 
                            ? 'text-orange-500 bg-orange-50' 
                            : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
                    }`}
                >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                    </svg>
                    <span className="text-xs font-medium">Цели</span>
                </Link>
            </div>
        </nav>
    );
};