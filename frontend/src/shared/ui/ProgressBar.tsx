interface ProgressBarProps {
    color: string
    percentage: number
}

export const ProgressBar = ({ color, percentage }: ProgressBarProps) => {
    return (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-[width] duration-700 ease-in-out shadow-sm`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )

}