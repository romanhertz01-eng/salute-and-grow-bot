import { FileText, FlaskConical, MessageSquare, Calculator } from "lucide-react";

const STEPS = [
  {
    n: 1,
    title: "41 сервис",
    description:
      "Собрали все сервисы зарубежных карт для России — из поисковой выдачи, Telegram-каналов и профильных форумов.",
    icon: null,
  },
  {
    n: 2,
    title: "Проверка лицензий",
    description:
      "Сверили банки-эмитенты с реестрами регуляторов Армении, Казахстана, Турции и Грузии.",
    icon: FileText,
  },
  {
    n: 3,
    title: "Анализ условий",
    description:
      "Разобрали тарифы, лимиты, комиссии и поддерживаемые сервисы по каждому кандидату.",
    icon: FlaskConical,
  },
  {
    n: 4,
    title: "5 200 отзывов",
    description:
      "Обработали отзывы с banki.ru, Otzovik, IRecommend, профильных веток Хабра и vc.ru.",
    icon: MessageSquare,
  },
  {
    n: 5,
    title: "Взвешенная формула",
    description:
      "Пять критериев с весами, балл от 0 до 5. Пересчитываем ежемесячно при изменении тарифов.",
    icon: Calculator,
  },
];

const WEIGHTS = [
  { label: "Надёжность эмитента и лицензия банка", value: 30 },
  { label: "Реальная цена владения (TCO за год)", value: 25 },
  { label: "Скорость выпуска и верификации", value: 20 },
  { label: "Apple Pay / Google Pay, бесконтакт", value: 15 },
  { label: "UX и качество поддержки", value: 10 },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Методология
        </div>
        <h2 className="max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Методология рейтинга: как считаем баллы
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Без субъективных оценок. Формула из пяти взвешенных критериев, публичные источники и ежемесячный пересчёт.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="rounded-xl border border-border bg-surface/40 p-5 transition hover:border-primary/20"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Шаг {step.n}
                </div>
                {Icon && (
                  <div className="mt-3 inline-flex rounded-lg bg-primary/5 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface/40 p-6 sm:p-8">
          <h3 className="font-serif text-xl font-semibold text-primary sm:text-2xl">
            Формула итогового балла
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Каждому критерию присвоен вес. Итоговый балл — взвешенная сумма по шкале 0–5.
          </p>
          <div className="mt-6 space-y-4">
            {WEIGHTS.map((w) => (
              <div key={w.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-primary">{w.label}</span>
                  <span className="font-semibold tabular-nums text-primary">{w.value}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${w.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
