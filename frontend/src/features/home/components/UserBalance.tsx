import type { balanceData } from "../hooks/useBalance"

interface UserBalanceProps {
    balanceData: balanceData | null;
}

export const UserBalance = ({balanceData} : UserBalanceProps) => {
    return (
        <div className="flex flex-col items-center gap-2 justify-top shadow-lg bg-white w-[90%] max-w-md rounded-lg p-5">
          <div className="flex flex-col">
            <h1 className="text-center w-full text-gray-700">Общее состояние финансов</h1>
            <h1 className="text-4xl text-center w-full flex gap-2 justify-center font-bold text-gray-900">
              {balanceData?.balance} ₽
            </h1>
          </div>
          <div className="flex flex-row items-center justify-between w-full mt-4">
            <h1 className="text-gray-700">Доходы</h1>
            <h1 className="text-xl text-orange-500 font-semibold">{balanceData?.income} ₽</h1>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-gray-700">Расходы</h1>
            <h1 className="text-xl text-orange-500 font-semibold">{balanceData?.expenses} ₽</h1>
          </div>
        </div>
    )
}