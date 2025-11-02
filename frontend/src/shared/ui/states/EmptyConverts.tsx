import { Button } from "@/shared/ui/Button";
import { useNavigate } from "react-router-dom";
import image from '../../../assets/empty-fallback-images/empty-converts-image.png'

export const EmptyConverts = () => {
    const navigate = useNavigate()
    return (
        <div className="flex justify-center flex-col items-center max-w-xl mx-auto space-y-0.5">
            <img src={image} width={124} height={124} alt="empty-expense-image.png" />
            <h1 className=''>У вас нет транзакций</h1>
            <p className="text-gray-500 mb-3">Вы пока не создали ни одной транзакции.</p>
            <Button
                title="Перейти к созданию"
                size="sm"
                onClick={() => navigate('/converts/add-converts')}
                bg="primary"
            />
        </div>
    )
}
