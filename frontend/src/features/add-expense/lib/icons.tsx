import type { LucideIcon } from "lucide-react"
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

export const EXPENSE_ICON_OPTIONS = Object.keys(EXPENSE_ICON_REGISTRY)
    .filter((key) => key !== "default")
    .map((key) => ({
        value: key,
        label: key,
    }))

interface ExpenseIconProps {
    name?: string | null
    color?: string
    size?: number
    className?: string
}

export const ExpenseIcon = ({
    name,
    color = "currentColor",
    size = 24,
    className,
}: ExpenseIconProps) => {
    const IconComponent =
        (name && EXPENSE_ICON_REGISTRY[name]) ?? EXPENSE_ICON_REGISTRY.default

    return <IconComponent className={className} color={color} size={size} />
}
