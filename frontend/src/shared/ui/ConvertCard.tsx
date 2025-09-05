import type { Convert } from "../types/types";

// Иконки для разных типов конвертов
const ConvertIcons = {
    necessary: '🛒',
    desire: '🎬',
    saving: '🏦',
    investment: '📈',
    default: '💰'
};

// Цвета для разных типов конвертов
const ConvertColors = {
    necessary: 'bg-blue-100 text-blue-600',
    desire: 'bg-purple-100 text-purple-600',
    saving: 'bg-green-100 text-green-600',
    investment: 'bg-orange-100 text-orange-600',
    default: 'bg-gray-100 text-gray-600'
};

// Компонент карточки конверта
export const ConvertCard: React.FC<{ convert: Convert }> = ({ convert }) => {
    const { convert_type, name, current_amount, limit_amount, target_amount, is_complete } = convert;
    const colorClass = ConvertColors[convert_type] || ConvertColors.default;
    const icon = ConvertIcons[convert_type] || ConvertIcons.default;

    const getProgress = () => {
        if (convert_type === 'saving' && target_amount) {
            return (current_amount / target_amount) * 100;
        }
        if ((convert_type === 'necessary' || convert_type === 'desire') && limit_amount) {
            return (current_amount / limit_amount) * 100;
        }
        return 0;
    };

    const getAmountText = () => {
        if (convert_type === 'saving') {
            return `${current_amount.toLocaleString('ru-RU')} / ${target_amount?.toLocaleString('ru-RU') || '∞'} ₽`;
        }
        return `${current_amount.toLocaleString('ru-RU')} / ${limit_amount?.toLocaleString('ru-RU') || '∞'} ₽`;
    };

    const getSubtitle = () => {
        switch (convert_type) {
            case 'necessary':
                return 'Еженедельные траты';
            case 'desire':
                return 'Желания';
            case 'saving':
                return is_complete ? 'Цель достигнута 🎉' : 'Накопления';
            case 'investment':
                return 'Инвестиции';
            default:
                return '';
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} text-lg`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{name}</h4>
                    <p className="text-sm text-gray-500">{getSubtitle()}</p>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-gray-900">{getAmountText()}</div>
                </div>
            </div>

            {(convert_type === 'saving' || convert_type === 'necessary' || convert_type === 'desire') && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(getProgress(), 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
}