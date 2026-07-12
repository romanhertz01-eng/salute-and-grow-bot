import { Link } from "@tanstack/react-router";
import { Zap, Coins, Building2, Users } from "lucide-react";

const CHANNELS = [
  {
    id: "sbp",
    icon: Zap,
    title: "СБП через РФ-партнёра",
    fee: "0–4%",
    time: "мгновенно, из любого банка РФ",
    text: "Самый быстрый и понятный путь для новичка. У части сервисов из рейтинга комиссия 0%. Банки ограничивают разовые СБП-переводы собственными лимитами.",
  },
  {
    id: "usdt",
    icon: Coins,
    title: "USDT TRC-20",
    fee: "1–2%",
    time: "5–15 минут, нужен криптокошелёк",
    text: "Гибче СБП, курс близок к биржевому. Требует базовых навыков работы с криптовалютой.",
  },
  {
    id: "swift",
    icon: Building2,
    title: "SWIFT-перевод",
    fee: "фикс. комиссия банка",
    time: "1–3 дня",
    text: "Имеет смысл для крупных сумм. Доступен через банки Армении и Казахстана. Не подходит для разового пополнения подписки.",
  },
  {
    id: "p2p",
    icon: Users,
    title: "P2P-обменники",
    fee: "0.5–1.5%",
    time: "10–30 минут",
    text: "Часто лучший курс, но выше риск контрагента — выбирайте площадки с большим числом отзывов. Вариант для опытных.",
  },
];

export function TopupSection() {
  return (
    <section id="topup" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Пополнение
        </div>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Как закидывать деньги на зарубежную карту
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Большая часть переплат — это комиссия пополнения. Сравните каналы,
          прежде чем оформлять карту.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="flex flex-col rounded-xl border border-border bg-surface/40 p-5"
              >
                <div className="inline-flex w-fit rounded-lg bg-primary/5 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-primary">
                  {c.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="font-semibold text-primary">{c.fee}</span>
                  <span className="text-muted-foreground">{c.time}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.text}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Комиссии — типичные рыночные диапазоны; точные условия смотрите в
          тарифе конкретной карты.{" "}
          <Link to="/" hash="rating" className="font-medium text-accent hover:underline">
            К рейтингу →
          </Link>
        </p>
      </div>
    </section>
  );
}