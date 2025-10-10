import { BalanceCard } from "@/shared/ui/BalanceCard"
import { Button } from "@/shared/ui/Button"
import { useNavigate } from "react-router-dom"

export const ConvertDashboard = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col gap-4">
            <BalanceCard
                title='Баланс конвертов'
                sum={80000}
                subtitle="Ваши конверты в полном порядке!"
            />
            <div className="flex justify-center">
                <Button title="+ Добавить конверт" onClick={
                    () => {
                        navigate('/converts/add-converts')
                    }
                }
                />
            </div>
        </div>
    )
}