import { EXPENSE_ICON_REGISTRY } from "../const/registry"

type ExpenseIconProps = {
  name?: string | null
  color?: string
  size?: number | string
  className?: string
  strokeWidth?: number
}

export const ExpenseIcon = ({
  name,
  color = "currentColor",
  size = 24,
  className,
  strokeWidth,
}: ExpenseIconProps) => {
  const Icon = EXPENSE_ICON_REGISTRY[name ?? "default"] ?? EXPENSE_ICON_REGISTRY.default

  return <Icon color={color} size={size} className={className} strokeWidth={strokeWidth} />
}
