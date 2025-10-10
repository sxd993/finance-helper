import { formatPrice } from "../utils/formatPrice";

interface BalanceCardProps {
    title: string;
    sum: number;
    subtitle?: string;
}

export const BalanceCard = ({ title, sum, subtitle }: BalanceCardProps) => {
    const formatedPrice = formatPrice(sum)
    return (
        <div className="flex bg-gradient-to-br from-primary to-secondary items-center justify-between flex-col py-6 px-2 rounded-3xl gap-1">
            <p className="text-blue-100 text-md opacity-90">{title}</p>
            <p className="text-white text-4xl mb-3">{formatedPrice}</p>
            <p className="text-sm text-green-200">{subtitle}</p>
        </div>
    )
}