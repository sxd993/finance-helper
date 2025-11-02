import type { ConvertGroup } from "@/entities/convert";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { useSavingGoals } from "../../lib/useSavingGoals";
import { LinearProgress } from "@/shared/ui/LinearProgress";

interface Props {
    convert: ConvertGroup;
}

export const SavingCardOverview = ({ convert }: Props) => {
    const { goals } = useSavingGoals();

    return (
        <div className="group">
            <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm transition-shadow duration-300 shadow-sm group-hover:shadow-xl">
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4 justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                {renderConvertIcon(convert.code)}
                            </div>
                            <div>
                                <span className="text-gray-900 text-lg">
                                    {convert.info.title}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {goals.length > 0 ? (
                            <ul className="space-y-3">
                                {goals.map((g) => (
                                    <li
                                        key={g.id}
                                        className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{g.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {g.progress != null
                                                        ? `Накоплено ${g.savedLabel} из ${g.targetLabel}`
                                                        : `Накоплено ${g.savedLabel}`}
                                                </p>
                                            </div>
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                                {g.progress != null ? `${Math.round(g.progress)}%` : "Без цели"}
                                            </span>
                                        </div>
                                        {g.progress != null && (
                                            <LinearProgress value={g.progress} className="mt-3" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-500">
                                Здесь появятся ваши цели накоплений, когда вы их создадите.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
