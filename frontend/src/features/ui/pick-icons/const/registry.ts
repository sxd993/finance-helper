import * as Icons from "lucide-react"
import { type LucideIcon } from "lucide-react"

export const EXPENSE_ICON_REGISTRY = {
  "shopping-cart": Icons.ShoppingCart,
  food: Icons.UtensilsCrossed,
  home: Icons.Home,
  transport: Icons.Car,
  gifts: Icons.Gift,
  savings: Icons.PiggyBank,
  wallet: Icons.Wallet,
  travel: Icons.Plane,
  health: Icons.Heart,
  sport: Icons.Dumbbell,
  education: Icons.Book,
  clothing: Icons.Shirt,
  entertainment: Icons.Gamepad2,
  hobby: Icons.Palette,
} satisfies Record<string, LucideIcon>

export type ExpenseIconName = keyof typeof EXPENSE_ICON_REGISTRY
export const DEFAULT_EXPENSE_ICON_NAME: ExpenseIconName = "shopping-cart"
export const DEFAULT_EXPENSE_ICON_COLOR = "#000"

export const EXPENSE_ICON_LABELS: Record<ExpenseIconName, string> = {
  "shopping-cart": "Покупки",
  food: "Питание",
  home: "Дом и коммуналка",
  transport: "Транспорт",
  gifts: "Подарки",
  savings: "Сбережения",
  wallet: "Кошелёк",
  travel: "Путешествия",
  health: "Здоровье",
  sport: "Спорт и фитнес",
  education: "Образование",
  clothing: "Одежда и аксессуары",
  entertainment: "Развлечения",
  hobby: "Хобби и творчество",
}

export const EXPENSE_ICON_OPTIONS = Object.entries(EXPENSE_ICON_REGISTRY).map(([key]) => ({
  value: key as ExpenseIconName,
  label: EXPENSE_ICON_LABELS[key as ExpenseIconName],
}))
