import { Plus, FolderPlus, Settings } from "lucide-react";
import type { QuickAction } from "../model/type";

export const actions: QuickAction[] = [
    {
        title: "Добавить трату",
        logo: <Plus className="text-green-500" />,
        action_func: () => console.log("add expense"),
    },
    {
        title: "Добавить конверт",
        logo: <FolderPlus className="text-blue-500" />,
        action_func: () => console.log("add envelope"),
    },
    {
        title: "Настройки",
        logo: <Settings className="text-slate-600" />,
        action_func: () => console.log("open settings"),
    },
];
