export const UserBalance = ({ monthly_income }: { monthly_income?: number }) => {
    return (
        <div className="flex flex-col items-center gap-2 justify-top shadow-lg bg-white w-[90%] max-w-md rounded-lg p-5">
          <div className="flex flex-col">
            <h1 className="text-center w-full text-gray-700">Ваш заработок в месяц</h1>
            <h1 className="text-4xl text-center w-full flex gap-2 justify-center font-bold text-gray-900">
              {monthly_income} ₽
            </h1>
          </div>
        </div>
    )
}