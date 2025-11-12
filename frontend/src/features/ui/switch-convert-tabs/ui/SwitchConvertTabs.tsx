import type { RootState } from "@/app/providers";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../store/ConvertTabs.slice";
import { convertTabsConfig } from "../config/tabs";
import { ConvertTabButton } from "./ConvertTabButton";

export const SwitchConvertTabs: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(
    (state: RootState) => state.convert_tabs.activeTab
  );

  return (
    <div
      className="
        flex gap-3 p-2 rounded-xl
        overflow-x-auto overflow-y-hidden
        whitespace-nowrap
        no-scrollbar
      "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>
        {`
          /* Chrome, Safari */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {convertTabsConfig.map((tab) => (
        <ConvertTabButton
          key={tab.value}
          tab={tab}
          isActive={activeTab === tab.value}
          onSelect={(value) => dispatch(setActiveTab(value))}
        />
      ))}
    </div>
  );
};
