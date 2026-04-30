import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { Logo } from "@/shared/ui/Logo";

const sections = [
  {
    title: "1. Предмет согласия",
    paragraphs: [
      "Настоящим пользователь подтверждает своё согласие на обработку персональных данных при использовании сервиса Finance Helper.",
      "Согласие предоставляется свободно, своей волей и в своём интересе для целей регистрации, авторизации и использования функциональности сервиса.",
    ],
  },
  {
    title: "2. Перечень данных",
    paragraphs: [
      "К персональным данным могут относиться логин, имя, email, сведения о доходе, параметры финансового распределения и иные данные, которые пользователь указывает в интерфейсе сервиса.",
    ],
  },
  {
    title: "3. Действия с персональными данными",
    paragraphs: [
      "Обработка может включать сбор, запись, систематизацию, хранение, уточнение, использование, передачу в пределах технической необходимости, обезличивание, блокирование и удаление данных.",
    ],
  },
  {
    title: "4. Цели обработки",
    paragraphs: [
      "Персональные данные обрабатываются для создания учётной записи, предоставления доступа к функциональности сервиса, расчёта пользовательских финансовых параметров и сопровождения работы аккаунта.",
    ],
  },
  {
    title: "5. Срок действия согласия",
    paragraphs: [
      "Согласие действует до достижения целей обработки либо до момента его отзыва пользователем, если иное не требуется законодательством.",
    ],
  },
  {
    title: "6. Отзыв согласия",
    paragraphs: [
      "Пользователь вправе отозвать согласие путём направления обращения оператору по контактам, указанным в правовых документах сервиса.",
      "После получения отзыва оператор прекращает обработку данных, кроме случаев, когда такая обработка допускается или требуется законом.",
    ],
  },
  {
    title: "7. Данные оператора",
    paragraphs: [
      "Оператор персональных данных: [указать полное наименование / ФИО].",
      "Контактный email: [указать email для обращений].",
      "Почтовый адрес: [указать юридический или почтовый адрес].",
    ],
  },
  {
    title: "8. Актуальность документа",
    paragraphs: [
      "Дата последней редакции: [указать дату].",
    ],
  },
];

export const PersonalDataConsentPage = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="app-page-container max-w-4xl py-8">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <Logo />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Finance Helper
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Согласие на обработку персональных данных
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Шаблон документа для замены на ваши реквизиты и финальную редакцию.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
