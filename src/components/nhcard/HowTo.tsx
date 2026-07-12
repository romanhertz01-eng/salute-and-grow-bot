const STEPS = [
  {
    n: 1,
    title: "Выбрать карту",
    text: "Используйте рейтинг, калькулятор и подбор выше. Зафиксируйте двух кандидатов — на случай отказа в верификации.",
    time: "~3 мин",
  },
  {
    n: 2,
    title: "Открыть приложение или бот",
    text: "У сервисов из рейтинга — мобильное приложение либо Telegram-бот с русским языком.",
    time: "~1 мин",
  },
  {
    n: 3,
    title: "Пройти регистрацию",
    text: "Номер телефона и e-mail. SMS-подтверждение приходит в течение минуты.",
    time: "~2 мин",
  },
  {
    n: 4,
    title: "Верификация (KYC), если требуется",
    text: "Часть карт выпускается без документов — смотрите параметр KYC в таблице. Где KYC нужен — фото паспорта и селфи, проверка от нескольких минут до суток.",
    time: "3 мин – 24 ч",
  },
  {
    n: 5,
    title: "Пополнить и выпустить карту",
    text: "Минимальное пополнение и стоимость выпуска — по тарифу выбранной карты (см. рейтинг).",
    time: "~2 мин",
  },
  {
    n: 6,
    title: "Привязать Apple / Google Pay",
    text: "Кнопка «Add to Wallet» в приложении. Поддержка Pay-сервисов отмечена в таблице.",
    time: "~1 мин",
  },
];

export const HOWTO_STEPS = STEPS;

export function HowToSection() {
  return (
    <section id="howto" className="scroll-mt-20 border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Оформление
        </div>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Как оформить зарубежную карту за 6 шагов
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Универсальная последовательность для карт из рейтинга. Типичные сроки —
          у самых быстрых сервисов.
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex flex-col rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {s.n}
                </div>
                <span className="text-xs font-medium text-accent">{s.time}</span>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-primary">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}