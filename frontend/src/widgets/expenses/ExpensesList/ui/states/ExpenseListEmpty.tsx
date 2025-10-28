import image from '../../../../../assets/empty-fallback-images/empty-expense-image.png';

export const ExpensesListEmpty = () => {
    return (
        <div className="flex justify-center flex-col items-center mt-2 mb-2 max-w-xl mx-auto">
            <img src={image} width={124} height={124} alt="empty-expense-image.png" />
            <h1 className='mb-1'>У вас нет транзакций</h1>
            <p className="text-gray-500">Вы пока не создали ни одной транзакции.</p>
        </div>
    )
}