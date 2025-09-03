import { Target } from 'lucide-react';

interface GoalsData {
    name: string;
    one_transfer: number;
    total_goals_sum: number;
    total_saved: number;
    nextTransfer: string;
}

interface GoalsCardProps {
    goalsData: GoalsData;
}

export const GoalsCard = ({ goalsData }: GoalsCardProps) => {
    const progress = (goalsData.total_saved / goalsData.total_goals_sum) * 100;

    return (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-black">{goalsData.name}</h3>
                        <p className="text-sm text-orange-600 font-medium">
                            {goalsData.total_saved.toLocaleString("ru-RU")} of {goalsData.total_goals_sum.toLocaleString("ru-RU")} ₽
                        </p>
                    </div>
                </div>
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-orange-700">Auto</span>
                </div>
            </div>

            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="text-center">
                    <p className="text-xs font-bold text-orange-600 uppercase">Weekly</p>
                    <p className="text-lg font-black text-black">
                        {goalsData.one_transfer.toLocaleString("ru-RU")} ₽
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs font-bold text-orange-600 uppercase">Next</p>
                    <p className="text-lg font-black text-black">{goalsData.nextTransfer}</p>
                </div>
            </div>
        </div>
    );
};
