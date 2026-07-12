import { Link } from "@tanstack/react-router";
import { Sparkles, ShoppingBag, Megaphone, Plane, Gamepad2, Briefcase, ArrowRight, type LucideIcon } from "lucide-react";

type TaskCard = {
  id: string;
  title: string;
  icon: LucideIcon;
  examples: string;
  to:
    | "/cards-for-subscriptions"
    | "/shopping-cards"
    | "/ads-cards"
    | "/travel-cards"
    | "/gaming-cards"
    | "/work-cards";
};

const TASKS: TaskCard[] = [
  { id: "subs", title: "Подписки и нейросети", icon: Sparkles, examples: "ChatGPT, Claude, Netflix, Spotify, Midjourney", to: "/cards-for-subscriptions" },
  { id: "shops", title: "Покупки в магазинах", icon: ShoppingBag, examples: "Amazon, eBay, AliExpress, iHerb", to: "/shopping-cards" },
  { id: "ads", title: "Реклама и маркетинг", icon: Megaphone, examples: "Google Ads, TikTok Ads", to: "/ads-cards" },
  { id: "travel", title: "Путешествия", icon: Plane, examples: "Booking, Airbnb, Agoda, авиабилеты", to: "/travel-cards" },
  { id: "games", title: "Игры и сторы", icon: Gamepad2, examples: "Steam, PlayStation, Xbox", to: "/gaming-cards" },
  { id: "work", title: "Работа и SaaS", icon: Briefcase, examples: "Adobe, Figma, Notion, GitHub, JetBrains", to: "/work-cards" },
];

export function TasksSection() {
  return (
    <section id="task" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          По задаче
        </div>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Какую карту выбрать под вашу задачу
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Платите за конкретный сервис — берите карту, которая под него заточена.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TASKS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                to={t.to}
                className="group flex flex-col rounded-xl border border-border bg-surface/40 p-6 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="inline-flex w-fit rounded-lg bg-primary/5 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-primary">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.examples}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Смотреть карты
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}