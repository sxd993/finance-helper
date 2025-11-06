interface TypeCardProps {
  title: string
  items: { label: string; value: string | number }[]
  description?: string
}

export const TypeCard = ({ title, items, description }: TypeCardProps) => (
  <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    {description && <p className="text-sm text-gray-600">{description}</p>}
    {items.length > 0 && (
      <div className="flex flex-col gap-2">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm text-gray-700">
            <span>{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
)