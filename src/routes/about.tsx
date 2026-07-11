import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoShell, H2, P, UL } from "@/components/nhcard/InfoShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О проекте — EraPay" },
      {
        name: "description",
        content:
          "EraPay — независимый мониторинг зарубежных виртуальных карт для россиян. Как устроена редакция, какие цифры за нами стоят и почему мы не эмитент.",
      },
      { property: "og:title", content: "О проекте — EraPay" },
      {
        property: "og:description",
        content:
          "Независимый мониторинг зарубежных виртуальных карт для россиян: редакция, миссия, цифры.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoShell
      eyebrow="О проекте"
      title="EraPay — независимый мониторинг зарубежных карт"
      lead="Мы не эмитент и не оказываем услуг по выпуску карт. Отслеживаем рынок с 2022 года: проверяем, сравниваем и помогаем выбрать зарубежную виртуальную карту под ваши задачи."
    >
      <H2>Что мы делаем</H2>
      <P>
        EraPay — независимая редакция, которая ведёт мониторинг зарубежных виртуальных карт,
        доступных россиянам. Мы разбираем условия эмитентов, проверяем реальные тарифы, собираем
        отзывы пользователей и следим за тем, что работает, а что перестало работать «сегодня».
      </P>
      <P>
        Мы не выпускаем карты, не принимаем платежи, не храним средства пользователей и не
        оказываем финансовых услуг. Оформление и обслуживание карты происходит на стороне
        эмитента, условия могут меняться — всегда сверяйте их перед оплатой.
      </P>

      <H2>Миссия</H2>
      <P>
        В 2022 году российским пользователям стало резко сложнее платить за международные сервисы.
        Рынок «карт на замену» вырос за несколько месяцев, и вместе с ним — количество непрозрачных
        предложений. EraPay появился, чтобы отделить работающие продукты от красивых лендингов и
        дать понятную картину: что реально оплачивает конкретная карта, сколько стоит выпуск и
        обслуживание, какие есть ограничения.
      </P>

      <H2>Редакция</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Автор</div>
          <div className="mt-1 font-serif text-lg font-bold text-primary">Дмитрий Соколовский</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Главный редактор EraPay. 9 лет пишет о международных платежах и финтехе.
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Фактчек</div>
          <div className="mt-1 font-serif text-lg font-bold text-primary">Марина Вишневская</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Финтех-аналитик EraPay. Сверяет тарифы, лимиты и условия эмитентов перед публикацией.
          </div>
        </div>
      </div>

      <H2>Цифры</H2>
      <UL>
        <li>41 сервис выпуска карт проанализирован</li>
        <li>15 продуктов в актуальном рейтинге</li>
        <li>5 200+ пользовательских отзывов обработано</li>
      </UL>

      <H2>Как это работает</H2>
      <P>
        Редакционная оценка формируется по <Link to="/methodology" className="text-primary underline decoration-primary/40 hover:decoration-primary">методологии</Link>{" "}
        из 5 критериев с фиксированными весами. Отдельно мы следим за{" "}
        <Link to="/editorial-policy" className="text-primary underline decoration-primary/40 hover:decoration-primary">
          редакционной независимостью
        </Link>
        : рекламные размещения технически и организационно отделены от рейтинга.
      </P>
    </InfoShell>
  );
}