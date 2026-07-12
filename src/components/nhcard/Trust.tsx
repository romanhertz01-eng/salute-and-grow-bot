import { Link } from "@tanstack/react-router";

const STATS: { value: string; label: string }[] = [
  { value: "41", label: "сервис проанализировали" },
  { value: "15", label: "прошли в рейтинг" },
  { value: "с 2022", label: "отслеживаем рынок" },
  { value: "5 200+", label: "отзывов обработали" },
];

export function TrustSection() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-xl border border-border bg-background p-8 shadow-sm sm:p-10 lg:p-14">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Прозрачность
          </div>
          <h2 className="max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            Рейтинг без рекламных мест — только проверенные данные
          </h2>

          <dl className="mt-10 grid grid-cols-2 gap-y-8 border-t border-border pt-10 lg:grid-cols-4 lg:gap-x-8">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-sm text-muted-foreground">{s.label}</dt>
                <dd className="order-1 font-serif text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-[72px] lg:leading-none">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground sm:text-sm">
            Некоторые ссылки на сайте — партнёрские: если вы оформите карту по ним, мы можем получить вознаграждение. Это не влияет на позиции —{" "}
            <Link to="/methodology" className="text-primary underline decoration-primary/40 hover:decoration-primary">единой методологии</Link>{" "}
            для всех сервисов. Подробнее — в{" "}
            <Link to="/affiliate-disclosure" className="text-primary underline decoration-primary/40 hover:decoration-primary">раскрытии партнёрских ссылок</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}