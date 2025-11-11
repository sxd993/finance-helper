import { MailPlus, Plus, Settings } from "lucide-react";
import type { QuickAction } from "../../../../features/ui/quick-actions/type";

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
      title: "Создать конверт",
      subtitle: "Настройте новый конверт",
      logo: <MailPlus className="text-blue-500" />,
      action_func: () => navigate('/converts/add-converts'),
    },
    {
      title: "Настройки бюджета",
      subtitle: "Подберите оптимальные лимиты",
      logo: <Settings className="text-slate-600" />,
      action_func: () => navigate('/settings'),
    },
  ];
};

