import { ShieldCheck, Users, Globe2, Link2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatToday } from "@/lib/cards";

export function Hero({ total }: { total: number }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-[1240px] items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-8 lg:py-12">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Мы не продаём карты. Мы проверяем, сравниваем и помогаем выбрать.
          </div>

          <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-5xl lg:text-[56px]">
            Зарубежные виртуальные карты для россиян 2026: рейтинг, сравнение и как оформить онлайн
          </h1>

          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-foreground/75">
            Карты российских банков не принимаются в App&nbsp;Store, Google&nbsp;Play, Netflix, Booking и большинстве
            зарубежных сервисов. EraPay — независимый мониторинг международных виртуальных карт, которые
            доступны из России: сравниваем условия, тарифы и надёжность эмитентов.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#rating"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              К рейтингу карт →
            </a>
            <Link
              to="/podbor"
              className="inline-flex h-11 items-center rounded-md border border-border bg-background px-6 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
            >
              Подобрать под задачу
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Chip icon={<Users className="h-3.5 w-3.5" />}>{total} сервисов в рейтинге</Chip>
            <Chip icon={<Globe2 className="h-3.5 w-3.5" />}>7 стран выпуска</Chip>
            <Chip icon={<ShieldCheck className="h-3.5 w-3.5" />} tone="accent">
              Проверено редакцией
            </Chip>
            <Chip icon={<Link2 className="h-3.5 w-3.5" />}>Партнёрские ссылки раскрыты</Chip>
          </div>
        </div>

        <aside className="self-start rounded-lg border border-border bg-background p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Кто составляет рейтинг
          </div>

          <div className="mt-5 flex items-start gap-4 border-b border-border pb-5">
            <Avatar initials="ДС" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Автор</div>
              <div className="mt-0.5 font-serif text-lg font-bold text-primary">Дмитрий Соколовский</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Главный редактор EraPay. 9 лет пишет о международных платежах и финтехе.
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <Avatar initials="МВ" tone="accent" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Фактчек</div>
              <div className="mt-0.5 font-serif text-lg font-bold text-primary">Марина Вишневская</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Финтех-аналитик EraPay. Сверила тарифы и условия эмитентов, {formatToday()}.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-surface px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Что обновилось
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
              <li>· «Плати&nbsp;по&nbsp;миру» вернул выпуск за 2&nbsp;минуты</li>
              <li>· WantToPay снизил обслуживание до 0&nbsp;₽</li>
              <li>· Heleket добавил поддержку USDT&nbsp;TRC-20</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Chip({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "accent";
}) {
  const cls =
    tone === "accent"
      ? "border-accent/30 bg-accent/8 text-accent"
      : "border-border bg-background text-foreground/75";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
    >
      {icon}
      {children}
    </span>
  );
}

function Avatar({ initials, tone }: { initials: string; tone?: "accent" }) {
  const cls =
    tone === "accent"
      ? "bg-accent text-accent-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold ${cls}`}
    >
      {initials}
    </div>
  );
}