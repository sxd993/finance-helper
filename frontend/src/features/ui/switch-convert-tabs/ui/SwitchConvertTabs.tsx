import React from "react";
import type { RootState } from "@/app/providers";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab, type ConvertTab } from "../store/ConvertTabs.slice";
import { renderConvertIcon } from "@/shared/utils/renderConvertIcon";
import { ta } from "date-fns/locale";

const tabs: { value: ConvertTab; label: string }[] = [
    { value: "important", label: "Необходимое" },
    { value: "wishes", label: "Желания" },
    { value: "saving", label: "Накопления" },
    { value: "investment", label: "Инвестиции" },
];

export const SwitchConvertTabs: React.FC = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state: RootState) => state.convert_tabs.activeTab);

    return (
        <div className="flex gap-5 bg-gray-100 p-2 rounded-xl justify-between">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => dispatch(setActiveTab(tab.value))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${activeTab === tab.value
                            ? "bg-gray-300 text-slate-900 shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <span className="flex items-center gap-2">{renderConvertIcon(tab.value)} {tab.label}</span>
                </button>
            ))}
        </div>
    );
};
