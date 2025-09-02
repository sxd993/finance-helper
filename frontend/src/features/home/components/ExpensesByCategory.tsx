import type { ExpensesByCategories } from "../hooks/useExpenseByCategory";

interface ExpensesByCategoryProps {
    Expenses: ExpensesByCategories[] | null | undefined;
}

export const ExpensesByCategory = ({Expenses}:ExpensesByCategoryProps) => {
    return (
        <div className="flex flex-col w-full p-10" >
      <h1>Расходы по категориям</h1>
      {Expenses?.map((category) => (
        <div key={category.category_id}>
          <div className="flex flex-row items-center justify-between mt-2">
            <h2 className=" text-neutral-500">{category.category_name}</h2>
            <p className=" text-orange-500">{category.total_amount} ₽</p>
          </div>
        </div>
      ))}
    </div>
    )
}