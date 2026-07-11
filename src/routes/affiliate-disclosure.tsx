import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoShell, H2, P, UL } from "@/components/nhcard/InfoShell";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => ({
    meta: [
      { title: "Раскрытие партнёрских ссылок — EraPay" },
      {
        name: "description",
        content:
          "Часть ссылок на EraPay — партнёрские. Мы можем получать комиссию, но это не влияет ни на цену для пользователя, ни на редакционную оценку.",
      },
      { property: "og:title", content: "Раскрытие партнёрских ссылок — EraPay" },
      {
        property: "og:description",
        content: "Как устроены партнёрские ссылки EraPay и почему они не влияют на рейтинг.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AffiliateDisclosurePage,
});

function AffiliateDisclosurePage() {
  return (
    <InfoShell
      eyebrow="Раскрытие"
      title="Раскрытие партнёрских ссылок"
      lead="Мы честны с читателем: часть ссылок на EraPay — партнёрские. Ниже — что это значит на практике."
    >
      <H2>Что это значит</H2>
      <P>
        Некоторые кнопки «Оформить» и ссылки в обзорах ведут на сайт эмитента карты через
        партнёрскую ссылку. Если вы оформите карту после перехода, EraPay может получить
        небольшую комиссию от эмитента.
      </P>

      <H2>На что это НЕ влияет</H2>
      <UL>
        <li>
          <b>Цена для вас не меняется.</b> Стоимость выпуска и обслуживания остаётся такой же, как
          если бы вы пришли на сайт эмитента напрямую.
        </li>
        <li>
          <b>Редакционная оценка не покупается.</b> Позиция в рейтинге считается по{" "}
          <Link to="/methodology" className="text-primary underline decoration-primary/40 hover:decoration-primary">
            методологии
          </Link>{" "}
          и не зависит от размера комиссии.
        </li>
        <li>
          <b>Отзывы не фильтруются в пользу партнёров.</b> Негативные отзывы остаются на месте.
        </li>
      </UL>

      <H2>Как отличить партнёрскую ссылку</H2>
      <P>
        Партнёрские ссылки помечены атрибутом{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">rel="sponsored"</code>{" "}
        и подписью «Партнёрская ссылка» рядом с кнопкой. Рекламные блоки маркируются словом
        «Реклама».
      </P>

      <H2>Зачем это нам</H2>
      <P>
        Партнёрская модель позволяет EraPay оставаться бесплатным для читателей и не зависеть от
        одного крупного рекламодателя. Подробнее — в{" "}
        <Link to="/editorial-policy" className="text-primary underline decoration-primary/40 hover:decoration-primary">
          редакционной политике
        </Link>
        .
      </P>
    </InfoShell>
  );
}