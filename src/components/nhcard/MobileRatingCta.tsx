import { useEffect, useState } from "react";

export function MobileRatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let scrolled = window.scrollY > 600;
    let ratingVisible = false;

    function update() {
      setVisible(scrolled && !ratingVisible);
    }

    function onScroll() {
      scrolled = window.scrollY > 600;
      update();
    }

    const target = document.getElementById("rating");
    let observer: IntersectionObserver | null = null;
    if (target && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) ratingVisible = e.isIntersecting;
          update();
        },
        { threshold: 0.05 },
      );
      observer.observe(target);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  function goToRating(e: React.MouseEvent) {
    e.preventDefault();
    const target = document.getElementById("rating");
    if (!target) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden motion-safe:transition-all motion-safe:duration-200 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <a
        href="#rating"
        onClick={goToRating}
        aria-label="Перейти к рейтингу карт"
        tabIndex={visible ? 0 : -1}
        className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 ring-1 ring-black/5 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        К рейтингу →
      </a>
    </div>
  );
}