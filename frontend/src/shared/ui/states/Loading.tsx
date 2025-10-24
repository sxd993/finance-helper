import { Loader } from "lucide-react"

interface LoadingProps {
    title: string
}

export const Loading = ({ title }: LoadingProps) => {
    return (
        <div className="flex justify-center items-start">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            <div className="text-lg">{title}</div>
        </div>
    )
}
