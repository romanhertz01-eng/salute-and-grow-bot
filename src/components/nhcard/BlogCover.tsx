type BlogCoverProps = {
  title: string;
  category?: string | null;
  emoji?: string | null;
  size?: "sm" | "md" | "lg";
};

// Deterministic surface tint from title
function pickTone(seed: string): { bg: string; fg: string; ring: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const tones = [
    { bg: "bg-primary", fg: "text-primary-foreground", ring: "border-primary/20" },
    { bg: "bg-surface", fg: "text-primary", ring: "border-border" },
    { bg: "bg-accent/10", fg: "text-primary", ring: "border-accent/30" },
    { bg: "bg-primary/95", fg: "text-primary-foreground", ring: "border-primary/30" },
  ];
  return tones[h % tones.length];
}

export function BlogCover({ title, category, emoji, size = "md" }: BlogCoverProps) {
  const tone = pickTone(title);
  const heights = { sm: "aspect-[16/9]", md: "aspect-[16/9]", lg: "aspect-[21/9]" };
  const titleSize = {
    sm: "text-base sm:text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl md:text-4xl",
  };
  return (
    <div
      className={`relative overflow-hidden rounded-lg border ${tone.ring} ${tone.bg} ${heights[size]}`}
      aria-hidden={emoji ? undefined : true}
    >
      <div className="absolute inset-0 flex items-center justify-center px-6 py-8">
        <span
          className={`text-center font-serif font-bold leading-tight tracking-tight ${tone.fg} ${titleSize[size]}`}
        >
          {title}
        </span>
      </div>
      {category && (
        <div className="absolute left-3 top-3 rounded bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent shadow-sm">
          {category}
        </div>
      )}
      {emoji && (
        <div className="absolute right-3 bottom-3 text-lg opacity-80" aria-hidden>
          {emoji}
        </div>
      )}
    </div>
  );
}