import { motion } from "framer-motion";

interface Tab<T extends string = string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string = string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
}

export const Tabs = <T extends string>({ tabs, active, onChange }: TabsProps<T>) => {
  return (
    <div className="flex relative bg-gray-100 rounded-full p-1 w-fit">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative px-4 py-1.5 text-sm font-medium rounded-full"
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-orange-500 rounded-full z-0"
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                isActive ? "text-white" : "text-gray-600"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
