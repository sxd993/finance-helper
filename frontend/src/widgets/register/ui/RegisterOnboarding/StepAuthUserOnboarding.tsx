import { useUserOnboarding } from "@/features/auth/model/useUserOnboarding"
import { onboardingCards } from "@/widgets/register/model/onboardingCards";
import { OnboardingCard } from "@/shared/ui/OnboardingCard";

export const StepAuthUserOnboarding = () => {
    const {
        onboardingStep,
        handleNextCard,
        handlePrevCard
    } = useUserOnboarding();

    const currentCard = onboardingCards[onboardingStep - 1];

    return (
        <div className="flex flex-col">
            {currentCard && (
                <OnboardingCard
                    key={currentCard.id}
                    id={currentCard.id}
                    title={currentCard.title}
                    description={currentCard.description}
                />
            )}
            <div className="mt-8 flex items-center justify-between text-2xl">
                <button
                    onClick={handlePrevCard}
                    className={`rounded-xl bg-primary py-2 px-4 text-white transition hover:bg-primary-dark ${onboardingStep === 1 ? "pointer-events-none opacity-0" : ""}`}
                >
                    {'<'}
                </button>
                <div className="flex flex-1 items-center justify-center gap-2">
                    {onboardingCards.map((card, idx) => {
                        const isActive = idx + 1 === onboardingStep;

                        return (
                            <span
                                key={card.id}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${isActive ? "scale-125 bg-primary" : "bg-slate-200"}`}
                            />
                        );
                    })}
                </div>
                <button
                    onClick={handleNextCard}
                    className={`rounded-xl bg-primary py-2 px-4 text-white transition hover:bg-primary-dark ${onboardingStep >= onboardingCards.length ? "pointer-events-none opacity-0" : ""}`}
                >
                    {'>'}
                </button>
            </div>
        </div>
    )

}
