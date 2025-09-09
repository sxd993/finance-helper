import type { Convert } from "../../../shared/types/types"
import { CircularProgress } from "../../../shared/ui/CircularProgress"

interface NeedAttentionConvertsProps {
    converts?: Convert[]
}

export const NeedAttentionConverts = ({ converts }: NeedAttentionConvertsProps) => {
    const filteredConverts =
        converts?.filter((c) => {
            if (
                (c.convert_type === "necessary" || c.convert_type === "desire") &&
                c.limit_amount
            ) {
                return c.current_amount / c.limit_amount < 0.2
            }
            return false
        }) ?? []

    if (filteredConverts.length === 0) {
        return null
    }

    return (
        <section className="rounded-2xl shadow-sm">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-orange-500 mb-2">
                    Конверты, требующие внимания
                </h1>
                <div className="w-12 h-0.5 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            <ul className="space-y-4">
                {filteredConverts.map((c) => {
                    const percentage = c.limit_amount
                        ? Math.round((c.current_amount / c.limit_amount) * 100)
                        : 0

                    return (
                        <li
                            key={c.id}
                            className="flex items-end justify-between p-4 bg-white rounded-xl shadow-sm"
                        >
                            {/* Левая часть */}
                            <div className="flex flex-col gap-2">
                                <h1 className="text-lg font-semibold">{c.convert_name}</h1>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Осталось на текущую неделю
                                    </p>
                                    <span className="text-2xl font-bold">
                                        {c.current_amount.toLocaleString("ru-RU")}
                                    </span>{" "}
                                    <span className="text-gray-500">₽</span>
                                    <p className="text-gray-500 text-sm">
                                        из {c.limit_amount?.toLocaleString("ru-RU")} ₽
                                    </p>
                                </div>
                            </div>

                            {/* Правая часть — прогресс */}
                            <CircularProgress
                                value={c.current_amount}
                                max={c.limit_amount}
                                percentage={percentage}
                                size={70}
                                strokeWidth={8}
                                showStatusText={false}
                            />
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
