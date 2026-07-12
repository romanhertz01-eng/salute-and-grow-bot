/**
 * Prevent ugly mid-number line wraps in money/number cells.
 * Pure string transform: does not change casing or non-matched text.
 */
export function noWrapMoney(text: string | null | undefined): string {
  if (!text) return "";
  let out = text;
  // digit groups: "2 990" -> "2\u00A0990" (repeat to catch "1 000 000")
  for (let i = 0; i < 3; i++) {
    out = out.replace(/(\d)\s+(\d)/g, "$1\u00A0$2");
  }
  // number + unit/currency
  out = out.replace(
    /(\d)\s+(₽|\$|€|%|мин|минут|час|часа|часов|дней|дня|день)/g,
    "$1\u00A0$2",
  );
  // "от " / "до " before a digit
  out = out.replace(/\b(от|до)\s+(?=\d)/g, "$1\u00A0");
  return out;
}