import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import type { ConvertTab } from "../store/ConvertTabs.slice";
import { useHasConvertRemainder } from "@/shared/hooks/useHasConvertRemainder";

interface ConvertTabButtonProps {
  tab: {
    value: ConvertTab;
    label: string;
  };
  isActive: boolean;
  onSelect: (value: ConvertTab) => void;
}

export const ConvertTabButton: React.FC<ConvertTabButtonProps> = ({
  tab,
  isActive,
  onSelect,
}) => {
  const hasRemainder = useHasConvertRemainder(tab.value);

  const baseClasses =
    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border";
  const activeClasses =
    "bg-blue-100 text-blue-800 border-blue-300 shadow-sm";
  const inactiveClasses =
    "bg-white text-gray-700 border-transparent";

  return (
    <button
      onClick={() => onSelect(tab.value)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {renderConvertIcon(tab.value)}
      <span>{tab.label}</span>

      {hasRemainder && (
        <span
          className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
          aria-hidden
        />
      )}
    </button>
  );
};
