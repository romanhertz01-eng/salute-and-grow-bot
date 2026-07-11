import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_ITEMS = [
  {
    q: "Что такое виртуальная зарубежная карта и зачем она нужна в 2026?",
    a: "Карта Visa или Mastercard иностранного эмитента в цифровом виде. Карты российских банков не работают за рубежом, поэтому зарубежная виртуальная карта — основной способ оплачивать ChatGPT, Netflix, Steam, рекламу и подписки.",
  },
  {
    q: "Как быстро выпускается виртуальная карта?",
    a: "У большинства сервисов мгновенно или за 10–15 минут после оплаты. Премиальные карты с IBAN — 1–3 рабочих дня.",
  },
  {
    q: "Можно ли пополнить зарубежную карту через СБП?",
    a: "Да, у 7 из 10 сервисов в топе. Пополнение через СБП занимает 1–5 минут, комиссия 0–4%. Лимит СБП — 100 000 ₽/день.",
  },
  {
    q: "Нужно ли уведомлять ФНС об открытии зарубежной карты?",
    a: "Да. В течение 30 дней с момента открытия счёта подайте уведомление КНД 1120107 через Личный кабинет налогоплательщика. Раз в год до 1 июня — отчёт о движении средств. Штраф за непредставление — 4–5 тыс. ₽.",
  },
  {
    q: "Какие документы нужны для оформления?",
    a: "Минимум — российский паспорт и номер телефона. Для премиум-тарифов с лимитами от $10 000/мес — загранпаспорт и подтверждение источника средств.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            FAQ
          </div>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Частые вопросы
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-md border border-border bg-surface px-5"
            >
              <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}