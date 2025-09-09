import { Tab, TabGroup, TabList } from "@headlessui/react";
import { useMemo } from "react";
import type { Convert } from "../../../shared/types/types";

interface ContainerTabsProps {
    converts: Convert[];
    active: string | null;
    onChange: (key: string) => void;
}

const TAB_CONFIG = {
    necessary: { label: "Необходимые", icon: "💰", description: "Обязательные расходы" },
    desire: { label: "Желаемые", icon: "🎯", description: "Необязательные покупки" },
    saving: { label: "Сбережения", icon: "🏦", description: "Накопления" },
    investment: { label: "Инвестиции", icon: "📈", description: "Вложения" },
} as const;

export const ContainerTabs = ({ converts, active, onChange }: ContainerTabsProps) => {
    const availableTabs = useMemo(() => {
        const uniqueTypes = Array.from(new Set(converts.map(c => c.convert_type)));
        return uniqueTypes.filter(type => type in TAB_CONFIG);
    }, [converts]);

    const tabCounts = useMemo(() => {
        return converts.reduce((acc, convert) => {
            acc[convert.convert_type] = (acc[convert.convert_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [converts]);

    if (!availableTabs.length) {
        return <div className="text-center py-8 text-gray-500">Нет доступных категорий</div>;
    }

    const selectedIndex = active ? availableTabs.indexOf(active) : 0;

    return (
        <section className="w-full">
            <TabGroup
                selectedIndex={selectedIndex}
                onChange={(index) => onChange(availableTabs[index])}
            >
                <TabList className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    {availableTabs.map((type) => {
                        const config = TAB_CONFIG[type as keyof typeof TAB_CONFIG];
                        const count = tabCounts[type] || 0;

                        return (
                            <Tab key={type} className="focus:outline-none">
                                {({ selected }) => (
                                    <div
                                        className={`
                      flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl
                      text-sm font-semibold transition-all duration-200
                      cursor-pointer select-none
                      ${selected
                                                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-105"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }
                    `}
                                    >
                                        <span className="text-2xl">{config.icon}</span>
                                        <span>{config.label}</span>
                                        {count > 0 && (
                                            <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${selected ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600"}
                      `}>
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Tab>
                        );
                    })}
                </TabList>
            </TabGroup>
        </section>
    );
};
