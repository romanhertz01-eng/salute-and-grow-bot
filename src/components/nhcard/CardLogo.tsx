import { useState, type SyntheticEvent } from "react";
import { initials } from "@/lib/cards";

type Props = {
  name: string;
  logoUrl?: string | null;
  logoDomain?: string | null;
  size?: number;
  /** Extra classes for the plate fallback (borders, radius, bg). */
  plateClassName?: string;
  /** Font-family class for the plate initials (defaults to serif). */
  plateFontClassName?: string;
};

type Stage = "url" | "favicon" | "plate";

function faviconUrl(domain: string): string {
  const clean = domain.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(clean)}&sz=64`;
}

/**
 * Agent logo with a favicon → plate cascade, matching the ServiceIcon pattern.
 * Priority: logoUrl → favicon by logoDomain → initials plate.
 */
export function CardLogo({
  name,
  logoUrl,
  logoDomain,
  size = 40,
  plateClassName = "rounded-md border border-border bg-surface text-primary",
  plateFontClassName = "font-serif",
}: Props) {
  const initial: Stage = logoUrl ? "url" : logoDomain ? "favicon" : "plate";
  const [stage, setStage] = useState<Stage>(initial);

  const advance = () => {
    setStage((s) => (s === "url" ? (logoDomain ? "favicon" : "plate") : "plate"));
  };
  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) advance();
  };

  if (stage === "plate") {
    const fontPx = Math.max(11, Math.round(size * 0.38));
    const chars = initials(name) || name.slice(0, 2).toUpperCase();
    return (
      <div
        aria-hidden
        style={{ width: size, height: size, fontSize: fontPx }}
        className={`flex shrink-0 select-none items-center justify-center font-bold ${plateFontClassName} ${plateClassName}`}
      >
        {chars}
      </div>
    );
  }

  const src = stage === "url" ? (logoUrl as string) : faviconUrl(logoDomain as string);

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={advance}
      onLoad={handleLoad}
      className={`shrink-0 object-contain ${plateClassName}`}
      style={{ width: size, height: size }}
    />
  );
}