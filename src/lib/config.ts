/**
 * Global site config.
 *
 * DEMO_MODE = true → сайт закрыт от индексации (карты/тарифы демо-данные).
 * Переключение на false открывает индексацию, robots.txt и убирает плашку.
 */
export const DEMO_MODE =
  (import.meta.env?.VITE_DEMO_MODE ?? "true").toString() !== "false";

/** Значение для <meta name="robots"> на публичных контентных страницах. */
export const PUBLIC_ROBOTS: string = DEMO_MODE
  ? "noindex, nofollow"
  : "index, follow";