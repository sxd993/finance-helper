interface TypeCardProps {
  title: string
  items: { label: string; value: string | number }[]
}

export const TypeCard = ({ title, items }: TypeCardProps) => (
  <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col">
          <dt className="text-slate-500">{label}</dt>
          <dd className="font-medium text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
)