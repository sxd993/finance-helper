
interface ErrorProps {
    error_name: string
}

export const Error = ({ error_name }: ErrorProps) => {
    return (
        <div className="flex justify-center items-start">
            <div className="text-lg">{error_name}</div>
        </div>
    )
}
