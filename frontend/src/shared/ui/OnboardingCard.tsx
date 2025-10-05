export interface OnboardingInfo {
    id: number;
    title: string;
    description: string;
}

export const OnboardingCard = ({
    id,
    title,
    description
}: OnboardingInfo) => {
    return (
        <div key={id} className="flex flex-col gap-5 items-center min-h-[250px] p-15">
            <h1>{title}</h1>
            <p>{description}</p>
            <img src="" />
        </div>
    )
}