import image from '../../../../../assets/empty-fallback-images/empty-expense-image.png';

export const UserExpensesListEmpty = () => {
    return (
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center text-center">
            <img
                src={image}
                alt="empty-expense-image"
                className="h-32 w-56 object-contain"
            />
            <h1 className="text-xl font-semibold text-slate-900">У вас пока нет расходов</h1>
        </div>
    )
}
