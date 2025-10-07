interface ButtonProps {
    title: string,
    onClick?: unknown
}

export const Button = ({ title, onClick }: ButtonProps) => {
    return (
        <button
            className="max-w-1/2 py-4 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-2xl"
            onClick={onClick}
        >
            {title}
        </button>
    )
}