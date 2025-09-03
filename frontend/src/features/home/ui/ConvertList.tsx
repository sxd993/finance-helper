import { CheckCircle, AlertTriangle } from 'lucide-react';

interface Convert {
    id: number;
    name: string;
    current: number;
    target: number;
    daysLeft: number;
    isComplete: boolean;
    category: string;
}

interface ConvertListProps {
    converts: Convert[];
    onConvertClick: (convertId: number) => void;
}

export const ConvertList = ({ converts, onConvertClick }: ConvertListProps) => {
    const categoryIcons: { [key: string]: string } = {
        'food': '🍕',
        'transport': '🚗',
        'entertainment': '🎬',
        'shopping': '🛍️',
        'health': '🏥',
        'education': '📚',
        'home': '🏠'
    };

    return (
        <div className="space-y-3">
            {converts.map((convert) => {
                const progress = Math.min((convert.current / convert.target) * 100, 100);
                const remaining = Math.max(convert.target - convert.current, 0);
                const isOverBudget = convert.current > convert.target;

                return (
                    <button 
                        key={convert.id} 
                        onClick={() => onConvertClick(convert.id)}
                        className="w-full bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                    {categoryIcons[convert.category] || '📄'}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{convert.name}</span>
                            </div>

                            {convert.isComplete ? (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Готово</span>
                                </div>
                            ) : isOverBudget ? (
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Превышено</span>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{remaining.toLocaleString("ru-RU")} ₽</p>
                                    <p className="text-xs text-gray-500">осталось</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-700 ${
                                        convert.isComplete ? 'bg-green-500' : 
                                        isOverBudget ? 'bg-red-500' : 'bg-orange-500'
                                    }`} 
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>Потрачено: <span className="font-medium text-gray-900">{convert.current.toLocaleString("ru-RU")} ₽</span></span>
                            <span className="text-orange-600">{convert.daysLeft} дн.</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ConvertList;
