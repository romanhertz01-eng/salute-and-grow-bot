export type ServiceCategory =
  | "ai"
  | "streaming"
  | "shops"
  | "games"
  | "ads"
  | "travel"
  | "work"
  | "crypto"
  | "messengers";

export type Service = {
  slug: string; // simple-icons slug OR unique key for plates
  name: string;
  category: ServiceCategory;
  plate?: boolean; // no icon in Simple Icons — always render plate
};

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  ai: "AI и нейросети",
  streaming: "Стриминг и медиа",
  shops: "Магазины и маркетплейсы",
  games: "Игры и сторы",
  ads: "Реклама",
  travel: "Путешествия",
  work: "Работа и SaaS",
  crypto: "Крипто",
  messengers: "Мессенджеры и облака",
};

export const CATEGORY_ORDER: ServiceCategory[] = [
  "ai",
  "streaming",
  "shops",
  "games",
  "ads",
  "travel",
  "work",
  "crypto",
  "messengers",
];

export const SERVICES: Service[] = [
  // AI
  { slug: "openai", name: "ChatGPT", category: "ai" },
  { slug: "claude", name: "Claude", category: "ai" },
  { slug: "deepseek", name: "DeepSeek", category: "ai" },
  { slug: "perplexity", name: "Perplexity", category: "ai" },
  { slug: "midjourney", name: "Midjourney", category: "ai", plate: true },
  { slug: "cursor", name: "Cursor", category: "ai", plate: true },
  { slug: "suno", name: "Suno", category: "ai", plate: true },
  { slug: "heygen", name: "HeyGen", category: "ai", plate: true },
  { slug: "elevenlabs", name: "ElevenLabs", category: "ai" },
  { slug: "abacusai", name: "Abacus.AI", category: "ai", plate: true },
  { slug: "tripoai", name: "Tripo AI", category: "ai", plate: true },
  { slug: "x", name: "x.AI", category: "ai", plate: true },
  { slug: "google", name: "Google One", category: "ai", plate: true },
  { slug: "githubcopilot", name: "GitHub Copilot", category: "ai" },
  { slug: "vercel", name: "v0.dev", category: "ai" },
  { slug: "freepik", name: "Freepik", category: "ai" },

  // Streaming
  { slug: "netflix", name: "Netflix", category: "streaming" },
  { slug: "spotify", name: "Spotify", category: "streaming" },
  { slug: "appletv", name: "Apple TV", category: "streaming" },
  { slug: "deezer", name: "Deezer", category: "streaming" },
  { slug: "youtube", name: "YouTube Premium", category: "streaming" },

  // Shops
  { slug: "amazon", name: "Amazon", category: "shops" },
  { slug: "ebay", name: "eBay", category: "shops" },
  { slug: "etsy", name: "Etsy", category: "shops" },
  { slug: "aliexpress", name: "AliExpress", category: "shops" },
  { slug: "temu", name: "Temu", category: "shops", plate: true },
  { slug: "walmart", name: "Walmart", category: "shops", plate: true },
  { slug: "iherb", name: "iHerb", category: "shops", plate: true },
  { slug: "dhgate", name: "DHgate", category: "shops", plate: true },
  { slug: "shopbase", name: "Shopbase", category: "shops", plate: true },
  { slug: "shopline", name: "Shopline", category: "shops", plate: true },

  // Games
  { slug: "steam", name: "Steam", category: "games" },
  { slug: "epicgames", name: "Epic Games", category: "games" },
  { slug: "playstation", name: "PlayStation", category: "games" },
  { slug: "appstore", name: "App Store", category: "games" },
  { slug: "googleplay", name: "Google Play", category: "games" },
  { slug: "wargaming", name: "Wargaming", category: "games", plate: true },
  { slug: "instantgaming", name: "Instant Gaming", category: "games", plate: true },
  { slug: "tebex", name: "Tebex", category: "games", plate: true },
  { slug: "nintendo", name: "Nintendo eShop", category: "games", plate: true },
  { slug: "xbox", name: "Xbox", category: "games" },

  // Ads
  { slug: "googleads", name: "Google Ads", category: "ads" },
  { slug: "tiktok", name: "TikTok Ads", category: "ads" },
  { slug: "meta", name: "Meta Ads", category: "ads" },
  { slug: "amazon-ads", name: "Amazon Ads", category: "ads", plate: true },
  { slug: "adspy", name: "ADSPY", category: "ads", plate: true },

  // Travel
  { slug: "bookingdotcom", name: "Booking", category: "travel" },
  { slug: "airbnb", name: "Airbnb", category: "travel" },
  { slug: "agoda", name: "Agoda", category: "travel" },
  { slug: "deutschebahn", name: "Deutsche Bahn", category: "travel", plate: true },
  { slug: "viagogo", name: "Viagogo", category: "travel", plate: true },
  { slug: "ticketmaster", name: "Ticketmaster", category: "travel" },
  { slug: "uber", name: "Uber", category: "travel" },
  { slug: "expedia", name: "Expedia", category: "travel" },

  // Work / SaaS
  { slug: "adobe", name: "Adobe", category: "work" },
  { slug: "figma", name: "Figma", category: "work" },
  { slug: "notion", name: "Notion", category: "work" },
  { slug: "canva", name: "Canva", category: "work" },
  { slug: "github", name: "GitHub", category: "work" },
  { slug: "gitbook", name: "GitBook", category: "work" },
  { slug: "jetbrains", name: "JetBrains", category: "work" },
  { slug: "fiverr", name: "Fiverr", category: "work" },
  { slug: "stripe", name: "Stripe", category: "work" },
  { slug: "godaddy", name: "GoDaddy", category: "work" },
  { slug: "cloudflare", name: "Cloudflare", category: "work" },
  { slug: "amazonaws", name: "AWS", category: "work" },
  { slug: "hetzner", name: "Hetzner", category: "work", plate: true },
  { slug: "decodo", name: "Decodo", category: "work", plate: true },
  { slug: "ableton", name: "Ableton", category: "work" },
  { slug: "italki", name: "italki", category: "work", plate: true },
  { slug: "cults3d", name: "Cults3D", category: "work", plate: true },
  { slug: "upwork", name: "Upwork", category: "work" },

  // Crypto
  { slug: "binance", name: "Binance", category: "crypto" },
  { slug: "trustwallet", name: "Trust Wallet", category: "crypto", plate: true },
  { slug: "coinbase", name: "Coinbase", category: "crypto", plate: true },
  { slug: "bybit", name: "Bybit", category: "crypto", plate: true },

  // Messengers / cloud
  { slug: "wechat", name: "WeChat", category: "messengers" },
  { slug: "discord", name: "Discord", category: "messengers" },
  { slug: "icloud", name: "iCloud", category: "messengers" },
  { slug: "microsoft", name: "Microsoft Store", category: "messengers" },
];

export const SERVICES_BY_SLUG: Record<string, Service> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);

/**
 * Deterministic per-card service list. When a card slug isn't in the explicit
 * map we fall back to a stable slice of the catalog sized to
 * `supported_services_count`.
 */
const CARD_SERVICE_MAP: Record<string, string[]> = {
  // Flagship — «Плати по миру»: полный набор
  "plati-po-miru": SERVICES.map((s) => s.slug),
};

function stableSlice(seed: string, count: number): string[] {
  const n = Math.min(Math.max(count, 0), SERVICES.length);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const start = h % SERVICES.length;
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(SERVICES[(start + i) % SERVICES.length].slug);
  return out;
}

export function getCardServiceSlugs(cardSlug: string, count: number): string[] {
  if (CARD_SERVICE_MAP[cardSlug]) return CARD_SERVICE_MAP[cardSlug];
  return stableSlice(cardSlug, count);
}

export function getCardServices(cardSlug: string, count: number): Service[] {
  return getCardServiceSlugs(cardSlug, count)
    .map((s) => SERVICES_BY_SLUG[s])
    .filter(Boolean);
}

export function simpleIconUrl(slug: string): string {
  return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Priority order of the most recognizable services for the table row preview.
 * Cards get their top-4 icons re-sorted to match this order first, then the
 * remaining catalog fills any leftover slots. Crypto logos are intentionally
 * absent — they only surface when the card has none of the popular services.
 */
const TABLE_PRIORITY_SLUGS: string[] = [
  "openai",       // ChatGPT
  "netflix",
  "spotify",
  "steam",
  "youtube",
  "adobe",
  "amazon",
  "googleplay",
  "appletv",
  "bookingdotcom", // Booking
];

/**
 * For crypto-focused cards (Heleket, e.PN) crypto/AI logos come first — that's
 * what their audience recognizes.
 */
const CRYPTO_CARD_PRIORITY_SLUGS: string[] = [
  "binance",
  "openai",       // ChatGPT
  "steam",
  "bybit",
  "coinbase",
  "trustwallet",
  "netflix",
  "spotify",
];

function isCryptoCard(cardSlug: string): boolean {
  const s = cardSlug.toLowerCase();
  return /heleket|e[-.]?pn|epn/.test(s);
}

/**
 * Returns up to `limit` slugs to render in the table row preview, deduped and
 * re-ordered by the priority list appropriate for the card. The modal keeps
 * the full unfiltered list.
 */
export function getTableServiceSlugs(
  cardSlug: string,
  allSlugs: string[],
  limit = 4,
): string[] {
  // Dedupe while preserving order.
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of allSlugs) {
    if (!s || seen.has(s)) continue;
    seen.add(s);
    unique.push(s);
  }

  const priority = isCryptoCard(cardSlug)
    ? CRYPTO_CARD_PRIORITY_SLUGS
    : TABLE_PRIORITY_SLUGS;

  const set = new Set(unique);
  const out: string[] = [];

  const hasRealIcon = (slug: string) => {
    const s = SERVICES_BY_SLUG[slug];
    return !!s && !s.plate;
  };

  // 1. Priority hits, in priority order.
  for (const p of priority) {
    if (set.has(p) && hasRealIcon(p)) out.push(p);
    if (out.length >= limit) return out;
  }

  // 2. Fill from the remaining card slugs in original order, skipping crypto
  //    for regular cards unless nothing else is available.
  const already = new Set(out);
  const isCrypto = (slug: string) => SERVICES_BY_SLUG[slug]?.category === "crypto";

  const nonCryptoRest = unique.filter(
    (s) => !already.has(s) && !isCrypto(s) && hasRealIcon(s),
  );
  for (const s of nonCryptoRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  // 3. Only now fall back to crypto logos (for regular cards with no popular
  //    services at all). For crypto cards this branch is unreachable since
  //    crypto slugs are already prioritized in step 1.
  const cryptoRest = unique.filter(
    (s) => !already.has(s) && isCrypto(s) && hasRealIcon(s) && !out.includes(s),
  );
  for (const s of cryptoRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  // 4. Last-resort fallback: allow plate services if we still don't have
  //    enough — the row must not be empty.
  const plateRest = unique.filter((s) => !out.includes(s));
  for (const s of plateRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  return out;
}
