import { Plus, Settings } from "lucide-react";
import type { QuickAction } from "./type";

interface useQuickActionsParams {
  navigate: (path: string) => void;
}

export const useQuickActions = ({ navigate }: useQuickActionsParams): QuickAction[] => {

  return [
    {
      title: "Добавить расход",
      subtitle: "Запишите расход или перевод",
      logo: <Plus className="text-green-500" />,
      action_func: () => navigate('/expenses/add-expense'),
    },
    {
      title: "Настройки бюджета",
      subtitle: "Подберите оптимальные лимиты",
      logo: <Settings className="text-slate-600" />,
      action_func: () => navigate('/settings'),
    },
  ];
};

