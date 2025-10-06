export interface OnboardingInfo {
    id: number;
    title: string;
    description: string;
    image?: string;
}

export const OnboardingCard = ({
    id,
    title,
    description,
    image
}: OnboardingInfo) => {
    return (
        <article
            key={id}
            className="flex min-h-[460px] flex-col items-center gap-8 rounded-3xl  bg-white/80 p-10 text-center backdrop-blur"
        >
            <figure className="flex flex-col items-center gap-4">
                {image && (
                    <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl from-primary/10 via-white to-primary/5">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}
                <figcaption className="space-y-3">
                    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                    <p className="text-base leading-relaxed text-slate-600">
                        {description}
                    </p>
                </figcaption>
            </figure>
        </article>
    );
};
