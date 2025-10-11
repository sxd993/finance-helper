interface SectionTitleProps {
    title: string,
    subtitle?: string,
    icon: any
}

export const SectionTitle = ({ title, subtitle, icon }: SectionTitleProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {title}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}