import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useSwitchOnboardingCards } from "../";
import { onboardingCards } from "../";
import { OnboardingCard } from "@/shared/ui/OnboardingCard";

export const RegisterUserOnboarding = ({ onBack, onNext }) => {

  const { onboardingStep, setOnboardingStep } = useSwitchOnboardingCards();
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (onboardingStep === 1) {
      onBack();
      return;
    }
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    if (onboardingStep >= onboardingCards.length) {
      onNext();
      return;
    }
    swiperRef.current?.slideNext();
  };

  return (
    <div className="flex flex-col">
      <Swiper className="max-w-[100%]"
        initialSlide={onboardingStep - 1}
        onSwiper={(instance) => {
          swiperRef.current = instance;
        }}
        onSlideChange={({ activeIndex }) => {
          const nextStep = (activeIndex + 1) as typeof onboardingStep;
          if (nextStep !== onboardingStep) {
            setOnboardingStep(nextStep);
          }
        }}
        spaceBetween={24}
        allowTouchMove
        slidesPerView={1}
      >
        {onboardingCards.map((card) => (
          <SwiperSlide key={card.id}>
            <OnboardingCard
              id={card.id}
              title={card.title}
              description={card.description}
              image={card.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 flex items-center justify-between text-sm">
        <button
          onClick={handlePrev}
          className="rounded-xl bg-primary py-2 px-4 text-white transition hover:bg-primary-dark"
        >
          {onboardingStep === 1 ? "Назад" : "<"}
        </button>

        <div className="flex flex-1 items-center justify-center gap-2">
          {onboardingCards.map((card, idx) => (
            <span
              key={card.id}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${idx + 1 === onboardingStep ? "scale-125 bg-primary" : "bg-slate-200"
                }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="rounded-xl bg-primary py-2 px-4 text-white transition hover:bg-primary-dark"
        >
          {onboardingStep >= onboardingCards.length ? "Продолжить" : ">"}
        </button>
      </div>
    </div>
  );
};
