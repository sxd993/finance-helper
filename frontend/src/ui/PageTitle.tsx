import { useAuth } from "../features/auth/hooks/useAuth";
import { ChevronRight, Plus } from "lucide-react";

interface PageTitleProps {
    title: string;
    icon?: React.ReactNode;
    isButton?: boolean;
    onButtonClick?: () => void;
}

export const PageTitle = ({ title, icon, isButton, onButtonClick }: PageTitleProps) => {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-between w-full px-[5%] pt-6">
            <div className="flex items-center gap-2">
                {icon && (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-orange-600">
                        {icon}
                    </div>
                )}
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                {isButton && (
                    <button
                        onClick={onButtonClick}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                )}

                {user && (
                    <div className="flex items-center">
                        <span className="text-lg font-medium text-black leading-none">{user.name}</span>
                        <ChevronRight className="pt-1"  />
                    </div>
                )}
            </div>
        </div>
    );
};