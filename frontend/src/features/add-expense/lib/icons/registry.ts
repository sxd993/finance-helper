import { type LucideIcon } from "lucide-react"
import {
  Book,
  Car,
  Circle,
  Dumbbell,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Palette,
  PiggyBank,
  Plane,
  ShoppingCart,
  Shirt,
  UtensilsCrossed,
  Wallet,
} from "lucide-react"

export const EXPENSE_ICON_REGISTRY = {
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
} satisfies Record<string, LucideIcon>

export type ExpenseIconName = keyof typeof EXPENSE_ICON_REGISTRY

export const DEFAULT_EXPENSE_ICON_NAME: ExpenseIconName = "shopping-cart"
export const DEFAULT_EXPENSE_ICON_COLOR = "#6366f1"

export const EXPENSE_ICON_LABELS: Record<Exclude<ExpenseIconName, "default">, string> = {
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

export type ExpenseIconOption = {
  value: keyof typeof EXPENSE_ICON_LABELS
  label: string
}

export const EXPENSE_ICON_OPTIONS: ExpenseIconOption[] = Object.entries(EXPENSE_ICON_LABELS).map(
  ([key, label]) => ({ value: key as keyof typeof EXPENSE_ICON_LABELS, label }),
)
