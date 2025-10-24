interface Props {
    name: string;
    category: string;
    sum: number;
    date: number
    logo?: string;
}

export const ExpenseCard = ({ expense }: Props) => {
    return (
        <div className="flex justify-between items-center w-full p-4">
            <div className="flex items-center">
                {expense.logo && (
                    <img src={expense?.logo} alt="Logo" />
                )}
                <div className="flex flex-col justify-between">
                    <span>{expense.name}</span>
                    <span>{expense.category}</span>
                </div>
            </div>
            <div></div>
        </div>
    )
}