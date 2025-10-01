import { Tab, TabGroup, TabList } from '@headlessui/react';
import { useMemo } from 'react';

import type { Convert } from '@shared/types/types';

const TAB_CONFIG = {
  necessary: { label: 'Необходимые', icon: '💰', description: 'Обязательные расходы' },
  desire: { label: 'Желаемые', icon: '🎯', description: 'Необязательные покупки' },
  saving: { label: 'Сбережения', icon: '🏦', description: 'Накопления' },
  investment: { label: 'Инвестиции', icon: '📈', description: 'Вложения' },
}

interface ContainerTabsProps {
  converts: Convert[];
  active: Convert['convert_type'] | null;
  onChange: (key: Convert['convert_type']) => void;
}

export const ContainerTabs = ({ converts, active, onChange }: ContainerTabsProps) => {
  const availableTabs = useMemo(() => {
    const uniqueTypes = Array.from(new Set(converts.map((c) => c.convert_type)));
    return uniqueTypes.filter((type): type is Convert['convert_type'] => type in TAB_CONFIG);
  }, [converts]);

  if (!availableTabs.length) {
    return <div className="text-center py-8 text-gray-500">Нет доступных категорий</div>;
  }

  const selectedIndex = active ? availableTabs.indexOf(active) : 0;

  return (
    <section className="w-full">
      <TabGroup
        selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
        onChange={(index) => onChange(availableTabs[index])}
      >
        <TabList className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {availableTabs.map((type) => {
            const config = TAB_CONFIG[type];

            return (
              <Tab key={type} className="focus:outline-none">
                {({ selected }) => (
                  <div
                    className={`
                      flex flex-row items-center justify-center gap-1 px-4 py-3 rounded-xl
                      text-sm font-semibold transition-all duration-200
                      cursor-pointer select-none
                      ${selected
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <span>{config.label}</span>
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
