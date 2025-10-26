import * as Icons from "lucide-react"

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
  const LucideIcon =
    (name && Icons[name as keyof typeof Icons]) || Icons.HelpCircle

  return (
    <LucideIcon
      color={color}
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  )
}
