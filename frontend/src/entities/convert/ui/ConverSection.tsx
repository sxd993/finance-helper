type ConvertSectionProps = {
    section_title: string
    children: React.ReactNode
}

export const ConvertSection: React.FC<ConvertSectionProps> = ({
    section_title,
    children,
}) => {
    return (
        <div className="flex flex-col">
            <h2>{section_title}</h2>
            {children}
        </div>
    )
}
