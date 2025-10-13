interface SectionTitleProps {
    title: string,
    subtitle?: string,
    icon?: any
}

export const SectionTitle = ({ title, icon }: SectionTitleProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
                <div className='flex items-center gap-2 '>
                        {icon}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {title}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}