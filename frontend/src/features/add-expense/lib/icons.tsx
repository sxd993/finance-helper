import { type LucideIcon } from "lucide-react"
import {
  Circle,
  ShoppingCart,
  UtensilsCrossed,
  Home,
  Car,
  Gift,
  PiggyBank,
  Wallet,
  Plane,
  Heart,
  Dumbbell,
  Book,
  Shirt,
  Gamepad2,
  Palette,
} from "lucide-react"

export const EXPENSE_ICON_REGISTRY: Record<string, LucideIcon> = {
  default: Circle,
  "shopping-cart": ShoppingCart,
  food: UtensilsCrossed,
  home: Home,
  transport: Car,
  gifts: Gift,
  savings: PiggyBank,
  wallet: Wallet,
  travel: Plane,
  health: Heart,
  sport: Dumbbell,
  education: Book,
  clothing: Shirt,
  entertainment: Gamepad2,
  hobby: Palette,
}

export const DEFAULT_EXPENSE_ICON_NAME = "shopping-cart"
export const DEFAULT_EXPENSE_ICON_COLOR = "#6366f1"

export const EXPENSE_ICON_LABELS: Record<keyof typeof EXPENSE_ICON_REGISTRY, string> = {
  "shopping-cart": "Покупки",
  food: "Питание",
  home: "Дом и коммуналка",
  transport: "Транспорт",
  gifts: "Подарки и благотворительность",
  savings: "Сбережения",
  wallet: "Наличные и кошельки",
  travel: "Путешествия",
  health: "Здоровье",
  sport: "Спорт и фитнес",
  education: "Образование",
  clothing: "Одежда и аксессуары",
  entertainment: "Развлечения",
  hobby: "Хобби и творчество",
}


export const EXPENSE_ICON_OPTIONS = Object.entries(EXPENSE_ICON_LABELS)
  .filter(([key]) => key !== "default")
  .map(([key, label]) => ({ value: key, label }))

interface ExpenseIconProps {
  name?: string | null
  color?: string
}

export const ExpenseIcon = ({ name, color = "currentColor" }: ExpenseIconProps) => {
  const Icon = EXPENSE_ICON_REGISTRY[name ?? "default"] ?? Circle
  return <Icon color={color} />
}
