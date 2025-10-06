import type { OnboardingInfo } from "@/shared/ui/OnboardingCard";

export type OnboardingCardList = OnboardingInfo[];

export const onboardingCards: OnboardingCardList = [
    {
        id: 1,
        title: "Что делает Finance Helper?",
        description: "Finance Helper помогает держать финансы под контролем. Ты видишь, сколько денег осталось в каждом конверте и можешь планировать траты без лишней головной боли.",
        image: 'https://img.icons8.com/?size=1200&id=P315u02MbQ5F&format=png'
    },
    {
        id: 2,
        title: "Система конвертов",
        description: "Все деньги делятся по конвертам: Important — нужные траты (еда, жильё), Wishes — удовольствия, Saving — накопления, Investments — инвестиции. По умолчанию действует схема 50/30/10/10, но ты можешь изменить проценты в настройках под себя.",
        image: "https://cdn-icons-png.flaticon.com/512/1264/1264365.png"
    },
    {
        id: 3,
        title: "Циклы",
        description: "Финансы живут по циклам — например, неделя. В начале цикла деньги распределяются по конвертам, а в конце — система их закрывает и фиксирует остатки. Так ты всегда знаешь, сколько потратил и что осталось.",
        image: "https://img.icons8.com/?size=1200&id=DILfEi3J82Mb&format=png"
    },
    {
        id: 4,
        title: "Остатки",
        description: "Когда цикл заканчивается, всё, что не потрачено, идёт в Остатки. Ты сам решаешь, куда отправить эти деньги — в накопления или инвестиции. Каждый цикл помогает тебе двигаться к финансовым целям. Деньги остались? Можно отложить",
        image: 'https://cdn-icons-png.flaticon.com/512/2770/2770647.png'
    },
    {
        id: 5,
        title: "Пример",
        description: "Если ты выбрал способ пополнения «Самостоятельно», создаётся транзакция. Например, пополняешь баланс на 5000₽ — Finance Helper делит: 2500₽ → Important, 1500₽ → Wishes, 500₽ → Saving и 500₽ → Investments. Теперь ты видишь, сколько осталось в каждом конверте и можешь тратить осознанно.",
        image: "https://cdn-icons-png.flaticon.com/512/4985/4985832.png"
    },
];
