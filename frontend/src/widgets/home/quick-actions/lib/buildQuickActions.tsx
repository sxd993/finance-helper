import { MailPlus, Plus, Settings } from "lucide-react";
import { formatPrice } from "@/shared/utils/formatPrice";
import type { QuickAction } from "../model/type";

interface BuildQuickActionsParams {
  navigate: (path: string) => void;
  availableBudget: number;
}

export const buildQuickActions = ({ navigate, availableBudget }: BuildQuickActionsParams): QuickAction[] => {
  const formattedAvailable = formatPrice(availableBudget) ?? "0 ₽";

  return [
    {
      title: "Добавить трату",
      subtitle: "Запишите расход или перевод",
      logo: <Plus className="text-green-500" />,
      action_func: () => navigate('/expenses/add-expense'),
    },
    {
      title: availableBudget > 0 ? "Распределить остаток" : "Создать конверт",
      subtitle: availableBudget > 0 ? `${formattedAvailable} свободно` : "Настройте новый конверт",
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

