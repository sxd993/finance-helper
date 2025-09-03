import { calculateProgress, formatMoney, getRemainingAmount } from '../utils/utils';
import { CheckCircle } from 'lucide-react';

export const ConvertSection = () => {
    const converts = [
        { id: 1, type: 'convert', name: "Еда", current: 5000, target: 10000, daysLeft: 3, isComplete: false },
        { id: 2, type: 'convert', name: "Транспорт", current: 2000, target: 2000, isComplete: true, daysLeft: 3 },
        { id: 3, type: 'convert', name: "Развлечения", current: 1500, target: 5000, daysLeft: 3, isComplete: false }
    ];

    const goals = {
        name: "Цели",
        one_transfer: 2250,
        total_goals_sum: 200000,
        total_saved: 127400,
        nextTransfer: "понедельник"
    };

    return (
        <section className='flex flex-col w-[90%] mx-auto'>
            <h1 className="text-2xl text-center mb-2">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Ваши финансовые конверты
                </span>
            </h1>
            {/* Заголовок */}
            <div className="mb-5 text-center">
                <h2 className="text-xl font-bold text-black mb-1">
                    На этой неделе
                </h2>
                <p className="text-sm text-gray-500">25 августа - 1 сентября</p>
            </div>

            {/* Конверты */}
            <div className="space-y-4">
                {converts.map((convert) => {
                    const progress = calculateProgress(convert.current, convert.target);
                    const remaining = getRemainingAmount(convert.current, convert.target);

                    return (
                        <div
                            key={convert.id}
                            className={`p-5 rounded-xl border transition-all duration-300 shadow-sm ${convert.isComplete
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                        >
                            {/* Верхняя строка */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg text-black">
                                        {convert.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    {convert.isComplete ? (
                                        <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm">
                                            <CheckCircle size={16} /> Выполнено
                                        </span>
                                    ) : (
                                        <>
                                            <div className="text-lg font-bold text-black">
                                                {formatMoney(remaining)} ₽
                                            </div>
                                            <div className="text-xs text-gray-500">осталось</div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Прогресс бар */}
                            <div className="mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Нижняя строка */}
                            <div className="flex flex-col justify-between items-center text-sm text-gray-700">
                                <span>
                                    Потрачено: <span className="font-medium text-black">{formatMoney(convert.current)} ₽</span>
                                </span>
                                <span className="font-medium">
                                    {convert.daysLeft} дн. до воскресенья
                                </span>
                            </div>

                            {/* Предупреждение */}
                            {!convert.isComplete && convert.current > convert.target && (
                                <div className="mt-3 p-2 bg-orange-100 border border-orange-300 rounded-md flex items-center gap-2 text-xs font-medium text-orange-700">

                                    Превышен лимит на {formatMoney(convert.current - convert.target)} ₽
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Секция целей */}
            <div className="mt-6 p-6 rounded-xl border border-orange-400 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="font-bold text-lg text-black">
                                {goals.name}
                            </span>
                            <div className="text-xs text-gray-600">
                                {formatMoney(goals.total_saved)} ₽ из {formatMoney(goals.total_goals_sum)} ₽
                            </div>
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-orange-600 border border-orange-500 px-2 py-0.5 rounded-full self-start sm:self-auto">
                        Автоперевод ✓
                    </span>
                </div>

                {/* Общий прогресс */}
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-2 bg-orange-500 rounded-full transition-all duration-700"
                            style={{ width: `${(goals.total_saved / goals.total_goals_sum) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center text-sm text-gray-700 gap-2">
                    <span>
                        Еженедельно: <span className="font-semibold text-black">{formatMoney(goals.one_transfer)} ₽</span>
                    </span>
                    <span>
                        Следующий перевод: <span className="font-semibold text-black">{goals.nextTransfer}</span>
                    </span>
                </div>
            </div>
        </section>
    );
};