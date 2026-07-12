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
  slug: string;
  name: string;
  category: ServiceCategory;
  domain: string;
  /** No usable public domain — always render initials plate. */
  plate?: boolean;
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
  // ai
  { slug: "openai", name: "ChatGPT", category: "ai", domain: "chatgpt.com" },
  { slug: "claude", name: "Claude", category: "ai", domain: "claude.ai" },
  { slug: "deepseek", name: "DeepSeek", category: "ai", domain: "deepseek.com" },
  { slug: "perplexity", name: "Perplexity", category: "ai", domain: "perplexity.ai" },
  { slug: "midjourney", name: "Midjourney", category: "ai", domain: "midjourney.com" },
  { slug: "cursor", name: "Cursor", category: "ai", domain: "cursor.com" },
  { slug: "suno", name: "Suno", category: "ai", domain: "suno.com" },
  { slug: "heygen", name: "HeyGen", category: "ai", domain: "heygen.com" },
  { slug: "elevenlabs", name: "ElevenLabs", category: "ai", domain: "elevenlabs.io" },
  { slug: "abacusai", name: "Abacus.AI", category: "ai", domain: "abacus.ai" },
  { slug: "tripoai", name: "Tripo AI", category: "ai", domain: "tripo3d.ai" },
  { slug: "x", name: "x.AI", category: "ai", domain: "x.ai" },
  { slug: "google", name: "Google One", category: "ai", domain: "one.google.com" },
  { slug: "githubcopilot", name: "GitHub Copilot", category: "ai", domain: "github.com" },
  { slug: "vercel", name: "v0.dev", category: "ai", domain: "v0.dev" },
  { slug: "freepik", name: "Freepik", category: "ai", domain: "freepik.com" },
  { slug: "runway", name: "Runway", category: "ai", domain: "runwayml.com" },
  { slug: "pika", name: "Pika Labs", category: "ai", domain: "pika.art" },
  { slug: "krea", name: "Krea", category: "ai", domain: "krea.ai" },
  { slug: "leonardoai", name: "Leonardo AI", category: "ai", domain: "leonardo.ai" },
  { slug: "ideogram", name: "Ideogram", category: "ai", domain: "ideogram.ai" },
  { slug: "stability", name: "Stability AI", category: "ai", domain: "stability.ai" },
  { slug: "lumalabs", name: "Luma Labs", category: "ai", domain: "lumalabs.ai" },
  { slug: "hailuo", name: "Hailuo AI", category: "ai", domain: "hailuoai.com" },
  { slug: "kling", name: "Kling AI", category: "ai", domain: "klingai.com" },
  { slug: "sora", name: "Sora", category: "ai", domain: "sora.com" },
  { slug: "gamma", name: "Gamma", category: "ai", domain: "gamma.app" },
  { slug: "descript", name: "Descript", category: "ai", domain: "descript.com" },
  { slug: "otter", name: "Otter.ai", category: "ai", domain: "otter.ai" },
  { slug: "grammarly", name: "Grammarly", category: "ai", domain: "grammarly.com" },
  { slug: "jasper", name: "Jasper", category: "ai", domain: "jasper.ai" },
  { slug: "copyai", name: "Copy.ai", category: "ai", domain: "copy.ai" },
  { slug: "writesonic", name: "Writesonic", category: "ai", domain: "writesonic.com" },
  { slug: "quillbot", name: "QuillBot", category: "ai", domain: "quillbot.com" },
  { slug: "deepl", name: "DeepL", category: "ai", domain: "deepl.com" },
  { slug: "rev", name: "Rev", category: "ai", domain: "rev.com" },
  { slug: "fathom", name: "Fathom", category: "ai", domain: "fathom.video" },
  { slug: "fireflies", name: "Fireflies.ai", category: "ai", domain: "fireflies.ai" },
  { slug: "notta", name: "Notta", category: "ai", domain: "notta.ai" },
  { slug: "tome", name: "Tome", category: "ai", domain: "tome.app" },
  { slug: "characterai", name: "Character.AI", category: "ai", domain: "character.ai" },
  { slug: "poe", name: "Poe", category: "ai", domain: "poe.com" },
  { slug: "huggingface", name: "Hugging Face", category: "ai", domain: "huggingface.co" },
  { slug: "replicate", name: "Replicate", category: "ai", domain: "replicate.com" },
  { slug: "colab", name: "Google Colab", category: "ai", domain: "colab.google" },
  { slug: "kaggle", name: "Kaggle", category: "ai", domain: "kaggle.com" },
  { slug: "wandb", name: "Weights & Biases", category: "ai", domain: "wandb.ai" },
  { slug: "langchain", name: "LangChain", category: "ai", domain: "langchain.com" },
  { slug: "pinecone", name: "Pinecone", category: "ai", domain: "pinecone.io" },
  { slug: "cohere", name: "Cohere", category: "ai", domain: "cohere.com" },
  { slug: "mistralai", name: "Mistral AI", category: "ai", domain: "mistral.ai" },
  { slug: "groq", name: "Groq", category: "ai", domain: "groq.com" },
  { slug: "togetherai", name: "Together AI", category: "ai", domain: "together.ai" },
  { slug: "tavily", name: "Tavily", category: "ai", domain: "tavily.com" },
  { slug: "phind", name: "Phind", category: "ai", domain: "phind.com" },
  { slug: "codeium", name: "Codeium", category: "ai", domain: "codeium.com" },
  { slug: "windsurf", name: "Windsurf", category: "ai", domain: "windsurf.com" },
  { slug: "zedindustries", name: "Zed", category: "ai", domain: "zed.dev" },
  { slug: "replit", name: "Replit", category: "ai", domain: "replit.com" },
  { slug: "stackblitz", name: "StackBlitz", category: "ai", domain: "stackblitz.com" },
  { slug: "codesandbox", name: "CodeSandbox", category: "ai", domain: "codesandbox.io" },
  { slug: "bolt", name: "Bolt.new", category: "ai", domain: "bolt.new" },
  { slug: "lovable", name: "Lovable", category: "ai", domain: "lovable.dev" },
  { slug: "warp", name: "Warp", category: "ai", domain: "warp.dev" },
  // streaming
  { slug: "netflix", name: "Netflix", category: "streaming", domain: "netflix.com" },
  { slug: "spotify", name: "Spotify", category: "streaming", domain: "spotify.com" },
  { slug: "appletv", name: "Apple TV+", category: "streaming", domain: "tv.apple.com" },
  { slug: "deezer", name: "Deezer", category: "streaming", domain: "deezer.com" },
  { slug: "youtube", name: "YouTube Premium", category: "streaming", domain: "youtube.com" },
  { slug: "hbo", name: "HBO Max", category: "streaming", domain: "max.com" },
  { slug: "disneyplus", name: "Disney+", category: "streaming", domain: "disneyplus.com" },
  { slug: "hulu", name: "Hulu", category: "streaming", domain: "hulu.com" },
  { slug: "primevideo", name: "Prime Video", category: "streaming", domain: "primevideo.com" },
  { slug: "paramountplus", name: "Paramount+", category: "streaming", domain: "paramountplus.com" },
  { slug: "peacock", name: "Peacock TV", category: "streaming", domain: "peacocktv.com" },
  { slug: "crunchyroll", name: "Crunchyroll", category: "streaming", domain: "crunchyroll.com" },
  { slug: "funimation", name: "Funimation", category: "streaming", domain: "funimation.com" },
  { slug: "mubi", name: "MUBI", category: "streaming", domain: "mubi.com" },
  { slug: "curiositystream", name: "CuriosityStream", category: "streaming", domain: "curiositystream.com" },
  { slug: "plutotv", name: "Pluto TV", category: "streaming", domain: "pluto.tv" },
  { slug: "tubi", name: "Tubi", category: "streaming", domain: "tubitv.com" },
  { slug: "dazn", name: "DAZN", category: "streaming", domain: "dazn.com" },
  { slug: "fubotv", name: "FuboTV", category: "streaming", domain: "fubo.tv" },
  { slug: "sling", name: "Sling TV", category: "streaming", domain: "sling.com" },
  { slug: "applemusic", name: "Apple Music", category: "streaming", domain: "music.apple.com" },
  { slug: "tidal", name: "Tidal", category: "streaming", domain: "tidal.com" },
  { slug: "pandora", name: "Pandora", category: "streaming", domain: "pandora.com" },
  { slug: "soundcloud", name: "SoundCloud", category: "streaming", domain: "soundcloud.com" },
  { slug: "amazonmusic", name: "Amazon Music", category: "streaming", domain: "music.amazon.com" },
  { slug: "audible", name: "Audible", category: "streaming", domain: "audible.com" },
  { slug: "scribd", name: "Scribd", category: "streaming", domain: "scribd.com" },
  { slug: "twitch", name: "Twitch", category: "streaming", domain: "twitch.tv" },
  { slug: "kick", name: "Kick", category: "streaming", domain: "kick.com" },
  { slug: "vimeo", name: "Vimeo", category: "streaming", domain: "vimeo.com" },
  { slug: "dailymotion", name: "Dailymotion", category: "streaming", domain: "dailymotion.com" },
  { slug: "napster", name: "Napster", category: "streaming", domain: "napster.com" },
  { slug: "iheartradio", name: "iHeartRadio", category: "streaming", domain: "iheart.com" },
  { slug: "bandcamp", name: "Bandcamp", category: "streaming", domain: "bandcamp.com" },
  { slug: "beatport", name: "Beatport", category: "streaming", domain: "beatport.com" },
  { slug: "qobuz", name: "Qobuz", category: "streaming", domain: "qobuz.com" },
  { slug: "shazam", name: "Shazam", category: "streaming", domain: "shazam.com" },
  { slug: "patreon", name: "Patreon", category: "streaming", domain: "patreon.com" },
  { slug: "onlyfans", name: "OnlyFans", category: "streaming", domain: "onlyfans.com" },
  { slug: "substack", name: "Substack", category: "streaming", domain: "substack.com" },
  // shops
  { slug: "amazon", name: "Amazon", category: "shops", domain: "amazon.com" },
  { slug: "ebay", name: "eBay", category: "shops", domain: "ebay.com" },
  { slug: "etsy", name: "Etsy", category: "shops", domain: "etsy.com" },
  { slug: "aliexpress", name: "AliExpress", category: "shops", domain: "aliexpress.com" },
  { slug: "temu", name: "Temu", category: "shops", domain: "temu.com" },
  { slug: "walmart", name: "Walmart", category: "shops", domain: "walmart.com" },
  { slug: "iherb", name: "iHerb", category: "shops", domain: "iherb.com" },
  { slug: "dhgate", name: "DHgate", category: "shops", domain: "dhgate.com" },
  { slug: "shopbase", name: "Shopbase", category: "shops", domain: "shopbase.com" },
  { slug: "shopline", name: "Shopline", category: "shops", domain: "shopline.com" },
  { slug: "shein", name: "SHEIN", category: "shops", domain: "shein.com" },
  { slug: "wish", name: "Wish", category: "shops", domain: "wish.com" },
  { slug: "target", name: "Target", category: "shops", domain: "target.com" },
  { slug: "bestbuy", name: "Best Buy", category: "shops", domain: "bestbuy.com" },
  { slug: "costco", name: "Costco", category: "shops", domain: "costco.com" },
  { slug: "nike", name: "Nike", category: "shops", domain: "nike.com" },
  { slug: "adidas", name: "Adidas", category: "shops", domain: "adidas.com" },
  { slug: "zara", name: "Zara", category: "shops", domain: "zara.com" },
  { slug: "hm", name: "H&M", category: "shops", domain: "hm.com" },
  { slug: "uniqlo", name: "UNIQLO", category: "shops", domain: "uniqlo.com" },
  { slug: "gap", name: "Gap", category: "shops", domain: "gap.com" },
  { slug: "levis", name: "Levi's", category: "shops", domain: "levi.com" },
  { slug: "puma", name: "Puma", category: "shops", domain: "puma.com" },
  { slug: "newbalance", name: "New Balance", category: "shops", domain: "newbalance.com" },
  { slug: "reebok", name: "Reebok", category: "shops", domain: "reebok.com" },
  { slug: "underarmour", name: "Under Armour", category: "shops", domain: "underarmour.com" },
  { slug: "northface", name: "The North Face", category: "shops", domain: "thenorthface.com" },
  { slug: "patagonia", name: "Patagonia", category: "shops", domain: "patagonia.com" },
  { slug: "lululemon", name: "Lululemon", category: "shops", domain: "lululemon.com" },
  { slug: "gucci", name: "Gucci", category: "shops", domain: "gucci.com" },
  { slug: "prada", name: "Prada", category: "shops", domain: "prada.com" },
  { slug: "louisvuitton", name: "Louis Vuitton", category: "shops", domain: "louisvuitton.com" },
  { slug: "chanel", name: "Chanel", category: "shops", domain: "chanel.com" },
  { slug: "hermes", name: "Hermès", category: "shops", domain: "hermes.com" },
  { slug: "burberry", name: "Burberry", category: "shops", domain: "burberry.com" },
  { slug: "apple", name: "Apple Store", category: "shops", domain: "apple.com" },
  { slug: "samsung", name: "Samsung Shop", category: "shops", domain: "samsung.com" },
  { slug: "dyson", name: "Dyson", category: "shops", domain: "dyson.com" },
  { slug: "bosch", name: "Bosch", category: "shops", domain: "bosch.com" },
  { slug: "lego", name: "LEGO", category: "shops", domain: "lego.com" },
  { slug: "hasbro", name: "Hasbro", category: "shops", domain: "hasbro.com" },
  { slug: "mattel", name: "Mattel", category: "shops", domain: "mattel.com" },
  { slug: "ikea", name: "IKEA", category: "shops", domain: "ikea.com" },
  { slug: "wayfair", name: "Wayfair", category: "shops", domain: "wayfair.com" },
  { slug: "homedepot", name: "Home Depot", category: "shops", domain: "homedepot.com" },
  { slug: "lowes", name: "Lowe's", category: "shops", domain: "lowes.com" },
  { slug: "sephora", name: "Sephora", category: "shops", domain: "sephora.com" },
  { slug: "ulta", name: "Ulta Beauty", category: "shops", domain: "ulta.com" },
  { slug: "macys", name: "Macy's", category: "shops", domain: "macys.com" },
  { slug: "nordstrom", name: "Nordstrom", category: "shops", domain: "nordstrom.com" },
  { slug: "asos", name: "ASOS", category: "shops", domain: "asos.com" },
  { slug: "farfetch", name: "Farfetch", category: "shops", domain: "farfetch.com" },
  { slug: "mytheresa", name: "Mytheresa", category: "shops", domain: "mytheresa.com" },
  { slug: "net-a-porter", name: "Net-a-Porter", category: "shops", domain: "net-a-porter.com" },
  { slug: "yoox", name: "YOOX", category: "shops", domain: "yoox.com" },
  { slug: "mrporter", name: "Mr Porter", category: "shops", domain: "mrporter.com" },
  { slug: "ssense", name: "SSENSE", category: "shops", domain: "ssense.com" },
  { slug: "stockx", name: "StockX", category: "shops", domain: "stockx.com" },
  { slug: "goat", name: "GOAT", category: "shops", domain: "goat.com" },
  { slug: "grailed", name: "Grailed", category: "shops", domain: "grailed.com" },
  { slug: "depop", name: "Depop", category: "shops", domain: "depop.com" },
  { slug: "vinted", name: "Vinted", category: "shops", domain: "vinted.com" },
  { slug: "mercari", name: "Mercari", category: "shops", domain: "mercari.com" },
  { slug: "poshmark", name: "Poshmark", category: "shops", domain: "poshmark.com" },
  { slug: "thredup", name: "thredUP", category: "shops", domain: "thredup.com" },
  // games
  { slug: "steam", name: "Steam", category: "games", domain: "store.steampowered.com" },
  { slug: "epicgames", name: "Epic Games", category: "games", domain: "epicgames.com" },
  { slug: "playstation", name: "PlayStation", category: "games", domain: "playstation.com" },
  { slug: "appstore", name: "App Store", category: "games", domain: "apps.apple.com" },
  { slug: "googleplay", name: "Google Play", category: "games", domain: "play.google.com" },
  { slug: "wargaming", name: "Wargaming", category: "games", domain: "wargaming.net" },
  { slug: "instantgaming", name: "Instant Gaming", category: "games", domain: "instant-gaming.com" },
  { slug: "tebex", name: "Tebex", category: "games", domain: "tebex.io" },
  { slug: "nintendo", name: "Nintendo eShop", category: "games", domain: "nintendo.com" },
  { slug: "xbox", name: "Xbox", category: "games", domain: "xbox.com" },
  { slug: "gog", name: "GOG.com", category: "games", domain: "gog.com" },
  { slug: "origin", name: "EA App / Origin", category: "games", domain: "ea.com" },
  { slug: "ubisoft", name: "Ubisoft Connect", category: "games", domain: "ubisoft.com" },
  { slug: "battlenet", name: "Battle.net", category: "games", domain: "battle.net" },
  { slug: "rockstargames", name: "Rockstar Games", category: "games", domain: "rockstargames.com" },
  { slug: "riotgames", name: "Riot Games", category: "games", domain: "riotgames.com" },
  { slug: "gamejolt", name: "Game Jolt", category: "games", domain: "gamejolt.com" },
  { slug: "itchdotio", name: "itch.io", category: "games", domain: "itch.io" },
  { slug: "humblebundle", name: "Humble Bundle", category: "games", domain: "humblebundle.com" },
  { slug: "greenmangaming", name: "Green Man Gaming", category: "games", domain: "greenmangaming.com" },
  { slug: "gamesplanet", name: "Gamesplanet", category: "games", domain: "gamesplanet.com" },
  { slug: "fanatical", name: "Fanatical", category: "games", domain: "fanatical.com" },
  { slug: "g2a", name: "G2A", category: "games", domain: "g2a.com" },
  { slug: "kinguin", name: "Kinguin", category: "games", domain: "kinguin.net" },
  { slug: "eneba", name: "Eneba", category: "games", domain: "eneba.com" },
  { slug: "cdkeys", name: "CDKeys", category: "games", domain: "cdkeys.com" },
  { slug: "gamivo", name: "Gamivo", category: "games", domain: "gamivo.com" },
  { slug: "k4g", name: "K4G", category: "games", domain: "k4g.com" },
  { slug: "mmoga", name: "MMOGA", category: "games", domain: "mmoga.com" },
  { slug: "driffle", name: "Driffle", category: "games", domain: "driffle.com" },
  { slug: "robuxstore", name: "Roblox", category: "games", domain: "roblox.com" },
  { slug: "minecraft", name: "Minecraft", category: "games", domain: "minecraft.net" },
  { slug: "mihoyo", name: "miHoYo", category: "games", domain: "mihoyo.com" },
  { slug: "hoyoverse", name: "HoYoverse", category: "games", domain: "hoyoverse.com" },
  { slug: "blizzard", name: "Blizzard", category: "games", domain: "blizzard.com" },
  { slug: "supercell", name: "Supercell", category: "games", domain: "supercell.com" },
  { slug: "garena", name: "Garena", category: "games", domain: "garena.com" },
  { slug: "krafton", name: "Krafton", category: "games", domain: "krafton.com" },
  { slug: "nexon", name: "Nexon", category: "games", domain: "nexon.com" },
  { slug: "gameflip", name: "Gameflip", category: "games", domain: "gameflip.com" },
  { slug: "razer", name: "Razer Gold", category: "games", domain: "razer.com" },
  // ads
  { slug: "googleads", name: "Google Ads", category: "ads", domain: "ads.google.com" },
  { slug: "tiktok", name: "TikTok Ads", category: "ads", domain: "ads.tiktok.com" },
  { slug: "meta", name: "Meta Ads", category: "ads", domain: "facebook.com" },
  { slug: "amazon-ads", name: "Amazon Ads", category: "ads", domain: "advertising.amazon.com" },
  { slug: "adspy", name: "ADSPY", category: "ads", domain: "adspy.com" },
  { slug: "microsoftads", name: "Microsoft Ads", category: "ads", domain: "ads.microsoft.com" },
  { slug: "linkedin", name: "LinkedIn Ads", category: "ads", domain: "linkedin.com" },
  { slug: "twitterads", name: "X Ads", category: "ads", domain: "ads.x.com" },
  { slug: "pinterest", name: "Pinterest Ads", category: "ads", domain: "pinterest.com" },
  { slug: "snapchat", name: "Snapchat Ads", category: "ads", domain: "snapchat.com" },
  { slug: "redditads", name: "Reddit Ads", category: "ads", domain: "ads.reddit.com" },
  { slug: "quorads", name: "Quora Ads", category: "ads", domain: "quora.com" },
  { slug: "bingads", name: "Bing Ads", category: "ads", domain: "ads.microsoft.com" },
  { slug: "outbrain", name: "Outbrain", category: "ads", domain: "outbrain.com" },
  { slug: "taboola", name: "Taboola", category: "ads", domain: "taboola.com" },
  { slug: "criteo", name: "Criteo", category: "ads", domain: "criteo.com" },
  { slug: "adroll", name: "AdRoll", category: "ads", domain: "adroll.com" },
  { slug: "semrush", name: "Semrush", category: "ads", domain: "semrush.com" },
  { slug: "ahrefs", name: "Ahrefs", category: "ads", domain: "ahrefs.com" },
  { slug: "similarweb", name: "Similarweb", category: "ads", domain: "similarweb.com" },
  { slug: "moz", name: "Moz", category: "ads", domain: "moz.com" },
  { slug: "hubspot", name: "HubSpot", category: "ads", domain: "hubspot.com" },
  { slug: "mailchimp", name: "Mailchimp", category: "ads", domain: "mailchimp.com" },
  { slug: "klaviyo", name: "Klaviyo", category: "ads", domain: "klaviyo.com" },
  // travel
  { slug: "bookingdotcom", name: "Booking", category: "travel", domain: "booking.com" },
  { slug: "airbnb", name: "Airbnb", category: "travel", domain: "airbnb.com" },
  { slug: "agoda", name: "Agoda", category: "travel", domain: "agoda.com" },
  { slug: "deutschebahn", name: "Deutsche Bahn", category: "travel", domain: "bahn.com" },
  { slug: "viagogo", name: "Viagogo", category: "travel", domain: "viagogo.com" },
  { slug: "ticketmaster", name: "Ticketmaster", category: "travel", domain: "ticketmaster.com" },
  { slug: "uber", name: "Uber", category: "travel", domain: "uber.com" },
  { slug: "expedia", name: "Expedia", category: "travel", domain: "expedia.com" },
  { slug: "hotels", name: "Hotels.com", category: "travel", domain: "hotels.com" },
  { slug: "kayak", name: "Kayak", category: "travel", domain: "kayak.com" },
  { slug: "skyscanner", name: "Skyscanner", category: "travel", domain: "skyscanner.com" },
  { slug: "trivago", name: "Trivago", category: "travel", domain: "trivago.com" },
  { slug: "hostelworld", name: "Hostelworld", category: "travel", domain: "hostelworld.com" },
  { slug: "vrbo", name: "Vrbo", category: "travel", domain: "vrbo.com" },
  { slug: "marriott", name: "Marriott", category: "travel", domain: "marriott.com" },
  { slug: "hilton", name: "Hilton", category: "travel", domain: "hilton.com" },
  { slug: "hyatt", name: "Hyatt", category: "travel", domain: "hyatt.com" },
  { slug: "ihg", name: "IHG", category: "travel", domain: "ihg.com" },
  { slug: "accor", name: "Accor", category: "travel", domain: "accor.com" },
  { slug: "radisson", name: "Radisson", category: "travel", domain: "radissonhotels.com" },
  { slug: "wizzair", name: "Wizz Air", category: "travel", domain: "wizzair.com" },
  { slug: "ryanair", name: "Ryanair", category: "travel", domain: "ryanair.com" },
  { slug: "easyjet", name: "easyJet", category: "travel", domain: "easyjet.com" },
  { slug: "lufthansa", name: "Lufthansa", category: "travel", domain: "lufthansa.com" },
  { slug: "britishairways", name: "British Airways", category: "travel", domain: "britishairways.com" },
  { slug: "airfrance", name: "Air France", category: "travel", domain: "airfrance.com" },
  { slug: "klm", name: "KLM", category: "travel", domain: "klm.com" },
  { slug: "emirates", name: "Emirates", category: "travel", domain: "emirates.com" },
  { slug: "qatarairways", name: "Qatar Airways", category: "travel", domain: "qatarairways.com" },
  { slug: "turkishairlines", name: "Turkish Airlines", category: "travel", domain: "turkishairlines.com" },
  { slug: "americanairlines", name: "American Airlines", category: "travel", domain: "aa.com" },
  { slug: "united", name: "United Airlines", category: "travel", domain: "united.com" },
  { slug: "delta", name: "Delta Air Lines", category: "travel", domain: "delta.com" },
  { slug: "southwest", name: "Southwest Airlines", category: "travel", domain: "southwest.com" },
  { slug: "jetblue", name: "JetBlue", category: "travel", domain: "jetblue.com" },
  { slug: "alaskaairlines", name: "Alaska Airlines", category: "travel", domain: "alaskaair.com" },
  { slug: "aeromexico", name: "Aeromexico", category: "travel", domain: "aeromexico.com" },
  { slug: "latam", name: "LATAM Airlines", category: "travel", domain: "latamairlines.com" },
  { slug: "ana", name: "ANA", category: "travel", domain: "ana.co.jp" },
  { slug: "singaporeair", name: "Singapore Airlines", category: "travel", domain: "singaporeair.com" },
  { slug: "cathay", name: "Cathay Pacific", category: "travel", domain: "cathaypacific.com" },
  { slug: "koreanair", name: "Korean Air", category: "travel", domain: "koreanair.com" },
  { slug: "lyft", name: "Lyft", category: "travel", domain: "lyft.com" },
  { slug: "bolt-travel", name: "Bolt Rides", category: "travel", domain: "bolt.eu" },
  { slug: "gett", name: "Gett", category: "travel", domain: "gett.com" },
  { slug: "didi", name: "DiDi", category: "travel", domain: "didiglobal.com" },
  { slug: "grab", name: "Grab", category: "travel", domain: "grab.com" },
  { slug: "ola", name: "Ola Cabs", category: "travel", domain: "olacabs.com" },
  { slug: "flixbus", name: "FlixBus", category: "travel", domain: "flixbus.com" },
  { slug: "omio", name: "Omio", category: "travel", domain: "omio.com" },
  { slug: "rome2rio", name: "Rome2Rio", category: "travel", domain: "rome2rio.com" },
  { slug: "trainline", name: "Trainline", category: "travel", domain: "thetrainline.com" },
  { slug: "eurail", name: "Eurail", category: "travel", domain: "eurail.com" },
  { slug: "getyourguide", name: "GetYourGuide", category: "travel", domain: "getyourguide.com" },
  { slug: "viator", name: "Viator", category: "travel", domain: "viator.com" },
  { slug: "klook", name: "Klook", category: "travel", domain: "klook.com" },
  { slug: "tripcom", name: "Trip.com", category: "travel", domain: "trip.com" },
  { slug: "tripadvisor", name: "Tripadvisor", category: "travel", domain: "tripadvisor.com" },
  { slug: "stubhub", name: "StubHub", category: "travel", domain: "stubhub.com" },
  { slug: "seatgeek", name: "SeatGeek", category: "travel", domain: "seatgeek.com" },
  { slug: "axs", name: "AXS", category: "travel", domain: "axs.com" },
  // work
  { slug: "adobe", name: "Adobe", category: "work", domain: "adobe.com" },
  { slug: "figma", name: "Figma", category: "work", domain: "figma.com" },
  { slug: "notion", name: "Notion", category: "work", domain: "notion.so" },
  { slug: "canva", name: "Canva", category: "work", domain: "canva.com" },
  { slug: "github", name: "GitHub", category: "work", domain: "github.com" },
  { slug: "gitbook", name: "GitBook", category: "work", domain: "gitbook.com" },
  { slug: "jetbrains", name: "JetBrains", category: "work", domain: "jetbrains.com" },
  { slug: "fiverr", name: "Fiverr", category: "work", domain: "fiverr.com" },
  { slug: "stripe", name: "Stripe", category: "work", domain: "stripe.com" },
  { slug: "godaddy", name: "GoDaddy", category: "work", domain: "godaddy.com" },
  { slug: "cloudflare", name: "Cloudflare", category: "work", domain: "cloudflare.com" },
  { slug: "amazonaws", name: "AWS", category: "work", domain: "aws.amazon.com" },
  { slug: "hetzner", name: "Hetzner", category: "work", domain: "hetzner.com" },
  { slug: "decodo", name: "Decodo", category: "work", domain: "decodo.com" },
  { slug: "ableton", name: "Ableton", category: "work", domain: "ableton.com" },
  { slug: "italki", name: "italki", category: "work", domain: "italki.com" },
  { slug: "cults3d", name: "Cults3D", category: "work", domain: "cults3d.com" },
  { slug: "upwork", name: "Upwork", category: "work", domain: "upwork.com" },
  { slug: "slack", name: "Slack", category: "work", domain: "slack.com" },
  { slug: "trello", name: "Trello", category: "work", domain: "trello.com" },
  { slug: "asana", name: "Asana", category: "work", domain: "asana.com" },
  { slug: "monday", name: "Monday.com", category: "work", domain: "monday.com" },
  { slug: "clickup", name: "ClickUp", category: "work", domain: "clickup.com" },
  { slug: "linear", name: "Linear", category: "work", domain: "linear.app" },
  { slug: "jira", name: "Jira", category: "work", domain: "atlassian.com" },
  { slug: "confluence", name: "Confluence", category: "work", domain: "atlassian.com" },
  { slug: "miro", name: "Miro", category: "work", domain: "miro.com" },
  { slug: "mural", name: "Mural", category: "work", domain: "mural.co" },
  { slug: "loom", name: "Loom", category: "work", domain: "loom.com" },
  { slug: "zoom", name: "Zoom", category: "work", domain: "zoom.us" },
  { slug: "googlemeet", name: "Google Meet", category: "work", domain: "meet.google.com" },
  { slug: "webex", name: "Webex", category: "work", domain: "webex.com" },
  { slug: "dropbox", name: "Dropbox", category: "work", domain: "dropbox.com" },
  { slug: "box", name: "Box", category: "work", domain: "box.com" },
  { slug: "googledrive", name: "Google Drive", category: "work", domain: "drive.google.com" },
  { slug: "onedrive", name: "OneDrive", category: "work", domain: "onedrive.live.com" },
  { slug: "pcloud", name: "pCloud", category: "work", domain: "pcloud.com" },
  { slug: "mega", name: "MEGA", category: "work", domain: "mega.io" },
  { slug: "gitlab", name: "GitLab", category: "work", domain: "gitlab.com" },
  { slug: "bitbucket", name: "Bitbucket", category: "work", domain: "bitbucket.org" },
  { slug: "codeberg", name: "Codeberg", category: "work", domain: "codeberg.org" },
  { slug: "gitea", name: "Gitea", category: "work", domain: "gitea.com" },
  { slug: "sentry", name: "Sentry", category: "work", domain: "sentry.io" },
  { slug: "datadoghq", name: "Datadog", category: "work", domain: "datadoghq.com" },
  { slug: "newrelic", name: "New Relic", category: "work", domain: "newrelic.com" },
  { slug: "posthog", name: "PostHog", category: "work", domain: "posthog.com" },
  { slug: "mixpanel", name: "Mixpanel", category: "work", domain: "mixpanel.com" },
  { slug: "amplitude", name: "Amplitude", category: "work", domain: "amplitude.com" },
  { slug: "segment", name: "Segment", category: "work", domain: "segment.com" },
  { slug: "googlecloud", name: "Google Cloud", category: "work", domain: "cloud.google.com" },
  { slug: "microsoftazure", name: "Microsoft Azure", category: "work", domain: "azure.microsoft.com" },
  { slug: "digitalocean", name: "DigitalOcean", category: "work", domain: "digitalocean.com" },
  { slug: "linode", name: "Linode", category: "work", domain: "linode.com" },
  { slug: "vultr", name: "Vultr", category: "work", domain: "vultr.com" },
  { slug: "ovh", name: "OVHcloud", category: "work", domain: "ovhcloud.com" },
  { slug: "scaleway", name: "Scaleway", category: "work", domain: "scaleway.com" },
  { slug: "netlify", name: "Netlify", category: "work", domain: "netlify.com" },
  { slug: "render", name: "Render", category: "work", domain: "render.com" },
  { slug: "railway", name: "Railway", category: "work", domain: "railway.com" },
  { slug: "fly", name: "Fly.io", category: "work", domain: "fly.io" },
  { slug: "supabase", name: "Supabase", category: "work", domain: "supabase.com" },
  { slug: "firebase", name: "Firebase", category: "work", domain: "firebase.google.com" },
  { slug: "planetscale", name: "PlanetScale", category: "work", domain: "planetscale.com" },
  { slug: "neondatabase", name: "Neon", category: "work", domain: "neon.tech" },
  { slug: "upstash", name: "Upstash", category: "work", domain: "upstash.com" },
  { slug: "mongodb", name: "MongoDB Atlas", category: "work", domain: "mongodb.com" },
  { slug: "redis", name: "Redis Cloud", category: "work", domain: "redis.io" },
  { slug: "sendgrid", name: "SendGrid", category: "work", domain: "sendgrid.com" },
  { slug: "mailgun", name: "Mailgun", category: "work", domain: "mailgun.com" },
  { slug: "postmark", name: "Postmark", category: "work", domain: "postmarkapp.com" },
  { slug: "resend", name: "Resend", category: "work", domain: "resend.com" },
  { slug: "namecheap", name: "Namecheap", category: "work", domain: "namecheap.com" },
  { slug: "namesilo", name: "NameSilo", category: "work", domain: "namesilo.com" },
  { slug: "porkbun", name: "Porkbun", category: "work", domain: "porkbun.com" },
  { slug: "hover", name: "Hover", category: "work", domain: "hover.com" },
  { slug: "dnsimple", name: "DNSimple", category: "work", domain: "dnsimple.com" },
  { slug: "shopify", name: "Shopify", category: "work", domain: "shopify.com" },
  { slug: "wix", name: "Wix", category: "work", domain: "wix.com" },
  { slug: "squarespace", name: "Squarespace", category: "work", domain: "squarespace.com" },
  { slug: "webflow", name: "Webflow", category: "work", domain: "webflow.com" },
  { slug: "framer", name: "Framer", category: "work", domain: "framer.com" },
  { slug: "wordpress", name: "WordPress.com", category: "work", domain: "wordpress.com" },
  { slug: "ghost", name: "Ghost", category: "work", domain: "ghost.org" },
  { slug: "bubble", name: "Bubble", category: "work", domain: "bubble.io" },
  { slug: "airtable", name: "Airtable", category: "work", domain: "airtable.com" },
  { slug: "zapier", name: "Zapier", category: "work", domain: "zapier.com" },
  { slug: "make", name: "Make", category: "work", domain: "make.com" },
  { slug: "ifttt", name: "IFTTT", category: "work", domain: "ifttt.com" },
  { slug: "n8n", name: "n8n", category: "work", domain: "n8n.io" },
  { slug: "coursera", name: "Coursera", category: "work", domain: "coursera.org" },
  { slug: "udemy", name: "Udemy", category: "work", domain: "udemy.com" },
  { slug: "edx", name: "edX", category: "work", domain: "edx.org" },
  { slug: "skillshare", name: "Skillshare", category: "work", domain: "skillshare.com" },
  { slug: "masterclass", name: "MasterClass", category: "work", domain: "masterclass.com" },
  { slug: "duolingo", name: "Duolingo", category: "work", domain: "duolingo.com" },
  { slug: "babbel", name: "Babbel", category: "work", domain: "babbel.com" },
  { slug: "busuu", name: "Busuu", category: "work", domain: "busuu.com" },
  { slug: "codecademy", name: "Codecademy", category: "work", domain: "codecademy.com" },
  { slug: "pluralsight", name: "Pluralsight", category: "work", domain: "pluralsight.com" },
  { slug: "linkedinlearning", name: "LinkedIn Learning", category: "work", domain: "linkedin.com" },
  { slug: "khanacademy", name: "Khan Academy", category: "work", domain: "khanacademy.org" },
  { slug: "brilliant", name: "Brilliant", category: "work", domain: "brilliant.org" },
  { slug: "elsa", name: "ELSA Speak", category: "work", domain: "elsaspeak.com" },
  { slug: "1password", name: "1Password", category: "work", domain: "1password.com" },
  { slug: "bitwarden", name: "Bitwarden", category: "work", domain: "bitwarden.com" },
  { slug: "lastpass", name: "LastPass", category: "work", domain: "lastpass.com" },
  { slug: "dashlane", name: "Dashlane", category: "work", domain: "dashlane.com" },
  { slug: "proton", name: "Proton", category: "work", domain: "proton.me" },
  { slug: "protonmail", name: "ProtonMail", category: "work", domain: "proton.me" },
  { slug: "tuta", name: "Tuta", category: "work", domain: "tuta.com" },
  { slug: "fastmail", name: "Fastmail", category: "work", domain: "fastmail.com" },
  { slug: "hey", name: "Hey", category: "work", domain: "hey.com" },
  { slug: "basecamp", name: "Basecamp", category: "work", domain: "basecamp.com" },
  { slug: "todoist", name: "Todoist", category: "work", domain: "todoist.com" },
  { slug: "things", name: "Things", category: "work", domain: "culturedcode.com" },
  { slug: "evernote", name: "Evernote", category: "work", domain: "evernote.com" },
  { slug: "obsidian", name: "Obsidian", category: "work", domain: "obsidian.md" },
  { slug: "bear", name: "Bear", category: "work", domain: "bear.app" },
  { slug: "readwise", name: "Readwise", category: "work", domain: "readwise.io" },
  { slug: "raindrop", name: "Raindrop.io", category: "work", domain: "raindrop.io" },
  { slug: "calendly", name: "Calendly", category: "work", domain: "calendly.com" },
  { slug: "cal", name: "Cal.com", category: "work", domain: "cal.com" },
  { slug: "doodle", name: "Doodle", category: "work", domain: "doodle.com" },
  { slug: "typeform", name: "Typeform", category: "work", domain: "typeform.com" },
  { slug: "surveymonkey", name: "SurveyMonkey", category: "work", domain: "surveymonkey.com" },
  { slug: "intercom", name: "Intercom", category: "work", domain: "intercom.com" },
  { slug: "zendesk", name: "Zendesk", category: "work", domain: "zendesk.com" },
  { slug: "freshdesk", name: "Freshdesk", category: "work", domain: "freshworks.com" },
  { slug: "crisp", name: "Crisp", category: "work", domain: "crisp.chat" },
  { slug: "drift", name: "Drift", category: "work", domain: "drift.com" },
  { slug: "hootsuite", name: "Hootsuite", category: "work", domain: "hootsuite.com" },
  { slug: "buffer", name: "Buffer", category: "work", domain: "buffer.com" },
  { slug: "later", name: "Later", category: "work", domain: "later.com" },
  { slug: "sproutsocial", name: "Sprout Social", category: "work", domain: "sproutsocial.com" },
  // crypto
  { slug: "binance", name: "Binance", category: "crypto", domain: "binance.com" },
  { slug: "trustwallet", name: "Trust Wallet", category: "crypto", domain: "trustwallet.com" },
  { slug: "coinbase", name: "Coinbase", category: "crypto", domain: "coinbase.com" },
  { slug: "bybit", name: "Bybit", category: "crypto", domain: "bybit.com" },
  { slug: "kraken", name: "Kraken", category: "crypto", domain: "kraken.com" },
  { slug: "okx", name: "OKX", category: "crypto", domain: "okx.com" },
  { slug: "kucoin", name: "KuCoin", category: "crypto", domain: "kucoin.com" },
  { slug: "bitget", name: "Bitget", category: "crypto", domain: "bitget.com" },
  { slug: "mexc", name: "MEXC", category: "crypto", domain: "mexc.com" },
  { slug: "gateio", name: "Gate.io", category: "crypto", domain: "gate.io" },
  { slug: "bitstamp", name: "Bitstamp", category: "crypto", domain: "bitstamp.net" },
  { slug: "crypto", name: "Crypto.com", category: "crypto", domain: "crypto.com" },
  { slug: "bitfinex", name: "Bitfinex", category: "crypto", domain: "bitfinex.com" },
  { slug: "gemini", name: "Gemini", category: "crypto", domain: "gemini.com" },
  { slug: "htx", name: "HTX", category: "crypto", domain: "htx.com" },
  { slug: "uniswap", name: "Uniswap", category: "crypto", domain: "uniswap.org" },
  { slug: "pancakeswap", name: "PancakeSwap", category: "crypto", domain: "pancakeswap.finance" },
  { slug: "metamask", name: "MetaMask", category: "crypto", domain: "metamask.io" },
  { slug: "phantom", name: "Phantom", category: "crypto", domain: "phantom.com" },
  { slug: "ledger", name: "Ledger", category: "crypto", domain: "ledger.com" },
  { slug: "trezor", name: "Trezor", category: "crypto", domain: "trezor.io" },
  { slug: "exodus", name: "Exodus", category: "crypto", domain: "exodus.com" },
  { slug: "blockchaindotcom", name: "Blockchain.com", category: "crypto", domain: "blockchain.com" },
  { slug: "etherscan", name: "Etherscan", category: "crypto", domain: "etherscan.io" },
  { slug: "tronscan", name: "Tronscan", category: "crypto", domain: "tronscan.org" },
  { slug: "polygon", name: "Polygon", category: "crypto", domain: "polygon.technology" },
  { slug: "chainlink", name: "Chainlink", category: "crypto", domain: "chain.link" },
  { slug: "solana", name: "Solana", category: "crypto", domain: "solana.com" },
  { slug: "ethereum", name: "Ethereum", category: "crypto", domain: "ethereum.org" },
  { slug: "bitcoin", name: "Bitcoin", category: "crypto", domain: "bitcoin.org" },
  // messengers
  { slug: "wechat", name: "WeChat", category: "messengers", domain: "wechat.com" },
  { slug: "discord", name: "Discord", category: "messengers", domain: "discord.com" },
  { slug: "icloud", name: "iCloud", category: "messengers", domain: "icloud.com" },
  { slug: "microsoft", name: "Microsoft Store", category: "messengers", domain: "microsoft.com" },
  { slug: "telegram", name: "Telegram Premium", category: "messengers", domain: "telegram.org" },
  { slug: "whatsapp", name: "WhatsApp Business", category: "messengers", domain: "whatsapp.com" },
  { slug: "signal", name: "Signal", category: "messengers", domain: "signal.org" },
  { slug: "viber", name: "Viber", category: "messengers", domain: "viber.com" },
  { slug: "line", name: "LINE", category: "messengers", domain: "line.me" },
  { slug: "kakaotalk", name: "KakaoTalk", category: "messengers", domain: "kakaocorp.com" },
  { slug: "skype", name: "Skype", category: "messengers", domain: "skype.com" },
  { slug: "nordvpn", name: "NordVPN", category: "messengers", domain: "nordvpn.com" },
  { slug: "expressvpn", name: "ExpressVPN", category: "messengers", domain: "expressvpn.com" },
  { slug: "surfshark", name: "Surfshark", category: "messengers", domain: "surfshark.com" },
  { slug: "protonvpn", name: "Proton VPN", category: "messengers", domain: "protonvpn.com" },
  { slug: "mullvad", name: "Mullvad", category: "messengers", domain: "mullvad.net" },
  { slug: "windscribe", name: "Windscribe", category: "messengers", domain: "windscribe.com" },
  { slug: "cyberghost", name: "CyberGhost", category: "messengers", domain: "cyberghostvpn.com" },
  { slug: "ipvanish", name: "IPVanish", category: "messengers", domain: "ipvanish.com" },
  { slug: "privateinternetaccess", name: "PIA", category: "messengers", domain: "privateinternetaccess.com" },
  { slug: "mailboxdotorg", name: "Mailbox.org", category: "messengers", domain: "mailbox.org" },
  { slug: "gmx", name: "GMX", category: "messengers", domain: "gmx.com" },
  { slug: "yandex", name: "Yandex Plus", category: "messengers", domain: "yandex.com" },
  { slug: "microsoft365", name: "Microsoft 365", category: "messengers", domain: "microsoft.com" },
  { slug: "google-workspace", name: "Google Workspace", category: "messengers", domain: "workspace.google.com" },
  { slug: "apple-icloud", name: "Apple One", category: "messengers", domain: "apple.com" },
  { slug: "mega-cloud", name: "MEGA Cloud", category: "messengers", domain: "mega.io" },
  { slug: "backblaze", name: "Backblaze", category: "messengers", domain: "backblaze.com" },
  { slug: "sync", name: "Sync.com", category: "messengers", domain: "sync.com" },
  { slug: "tresorit", name: "Tresorit", category: "messengers", domain: "tresorit.com" },
  { slug: "nordpass", name: "NordPass", category: "messengers", domain: "nordpass.com" },
  { slug: "keepassxc", name: "KeePassXC", category: "messengers", domain: "keepassxc.org" },
  { slug: "authy", name: "Authy", category: "messengers", domain: "authy.com" },
];
export const SERVICES_BY_SLUG: Record<string, Service> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s]),
);

// Per-card exact service counts (matches Exnode benchmark).
const CARD_SERVICE_COUNTS: Record<string, number> = {
  "plati-po-miru": 364,
  "wanttopay": 283,
  "wayment": 216,
  "aifory-pro": 143,
  "flowbit-finance": 107,
  "zarub": 117,
  "o-plata": 30,
  "mig-pay": 35,
  "chocopay": 64,
  "easy-payments": 119,
  "terbium-wallet": 117,
  "cardclub": 22,
  "morekart": 119,
  "e-pn": 42,
  "heleket": 29,
};

// Crypto-first ordering used by heleket / e-pn.
const CRYPTO_FIRST_CATEGORIES: ServiceCategory[] = [
  "crypto",
  "ai",
  "games",
  "streaming",
  "shops",
  "work",
  "ads",
  "travel",
  "messengers",
];

function catalogByCategoryOrder(order: ServiceCategory[]): string[] {
  const out: string[] = [];
  for (const cat of order) {
    for (const s of SERVICES) {
      if (s.category === cat) out.push(s.slug);
    }
  }
  return out;
}

const DEFAULT_ORDER: string[] = SERVICES.map((s) => s.slug);
const CRYPTO_ORDER: string[] = catalogByCategoryOrder(CRYPTO_FIRST_CATEGORIES);

function isCryptoCardSlug(cardSlug: string): boolean {
  const s = cardSlug.toLowerCase();
  return /heleket|e[-.]?pn|epn/.test(s);
}

// Real service sets sourced from Exnode, intersected with the SERVICES catalog.
// Unknown slugs are silently filtered out at read time via SERVICES_BY_SLUG.
const CARD_REAL_SERVICES: Record<string, string[]> = {
  "plati-po-miru": [
    "openai","claude","deepseek","cursor","elevenlabs","githubcopilot","freepik","suno","tripoai","heygen",
    "x","vercel","google","netflix","spotify","deezer","youtube","steam","epicgames","playstation",
    "nintendo","appstore","googleplay","xbox","amazon","ebay","etsy","aliexpress","iherb","temu",
    "walmart","shein","adobe","figma","notion","canva","github","jetbrains","gitbook","fiverr",
    "stripe","godaddy","cloudflare","amazonaws","ableton","binance","trustwallet","wechat","discord","icloud",
    "microsoft","paypal","googleads","tiktok","meta","amazon-ads","adspy","bookingdotcom","airbnb","agoda",
    "ticketmaster","uber","expedia","viagogo","dhl","deutschebahn","linkedin","patreon","zoom","telegram",
  ],
  "wanttopay": [
    "openai","claude","midjourney","netflix","spotify","googleads","tiktok","googleplay","appstore","applepay",
    "wizzair","aliexpress","alipay","atlassian","audible","cloudflare","crunchyroll","deepl","disneyplus","duolingo",
    "ebay","emirates","expedia","framer","hostinger","hulu","linear","lovable","telegram","tinder",
    "uber","udemy","upwork","vercel","webflow","zara","adidas","airfrance","shopify","slack",
    "soundcloud","squarespace","strava","substack","supabase","surfshark","vinted","wolt","twilio",
  ],
  "wayment": [
    "openai","claude","agoda","amazon-ads","appletv","cursor","deezer","elevenlabs","etsy","fiverr",
    "githubcopilot","godaddy","googleplay","hbo","hetzner","heygen","icloud","iherb","jetbrains","krea",
    "notion","paypal","shein","spotify","stripe","suno","temu","tiktok","walmart","wechat",
    "airbnb","amazon","applemusic","appstore","bookingdotcom","canva","discord","dropbox","envato","figma",
    "gamma","github","googleads","grok","netflix","runway","twitch","youtube","zoom","roblox",
    "shopify","telegram","uber","vercel",
  ],
  "aifory-pro": [
    "openai","abacusai","ableton","agoda","appletv","cursor","deepseek","deezer","dhgate","dhl",
    "epicgames","etsy","fiverr","freepik","gitbook","godaddy","google","heygen","icloud","iherb",
    "jetbrains","linkedin","midjourney","notion","patreon","paypal","playstation","shein","stripe","suno",
    "temu","tiktok","tripoai","walmart","wechat","airbnb","amazon","applemusic","appstore","canva",
    "discord","dropbox","elevenlabs","envato","figma","gamma","github","netflix","runway","spotify",
    "twitch","youtube","zoom","nintendo",
  ],
  "flowbit-finance": [
    "openai","adobe","agoda","appletv","cursor","elevenlabs","freepik","githubcopilot","google","hetzner",
    "icloud","jetbrains","krea","linkedin","notion","shein","suno","claude","airbnb","applemusic",
    "bookingdotcom","canva","dropbox","envato","figma","github","midjourney","netflix","runway","spotify",
    "tiktok","youtube","zoom","cloudflare","crunchyroll","disneyplus","duolingo","framer","hostinger","hulu",
    "lovable","paramount","poe","supabase","surfshark","telegram","udemy","vercel","webflow","zara",
  ],
  "zarub": [
    "openai","adobe","amazon-ads","amazonaws","cursor","deepseek","freepik","google","heygen","jetbrains",
    "kling","krea","midjourney","patreon","paypal","playstation","suno","tiktok","tripoai","amazon",
    "canva","claude","discord","elevenlabs","envato","figma","gamma","github","grok","netflix",
    "runway","spotify","zoom","xbox","binance","cloudflare","ebay","hostinger","ideogram","lovable",
    "replit","roblox","supabase","surfshark","udemy","unity","vercel","vultr","windsurf",
  ],
  "o-plata": [
    "adobe","google","notion","patreon","playstation","applemusic","canva","discord","netflix","spotify",
    "steam","tiktok","twitch","youtube","zoom","xbox",
  ],
  "mig-pay": [
    "openai","cursor","deepseek","githubcopilot","googleplay","iherb","jetbrains","kling","krea","patreon",
    "suno","airbnb","appstore","bookingdotcom","canva","elevenlabs","envato","figma","gamma","google",
    "grok","midjourney","runway","youtube",
  ],
  "chocopay": [
    "openai","adobe","agoda","appletv","cursor","epicgames","freepik","godaddy","google","icloud",
    "jetbrains","kling","linkedin","notion","nintendo","playstation","tiktok","airbnb","amazon","appstore",
    "canva","claude","discord","elevenlabs","envato","figma","googleads","github","midjourney","netflix",
    "runway","spotify","steam","youtube","zoom","xbox",
  ],
  "easy-payments": [
    "openai","abacusai","ableton","adobe","adspy","agoda","amazon-ads","amazonaws","binance","cursor",
    "deepseek","deezer","dhgate","dhl","elevenlabs","epicgames","etsy","fiverr","freepik","gitbook",
    "githubcopilot","google","hetzner","heygen","icloud","iherb","jetbrains","linkedin","midjourney","notion",
    "patreon","paypal","playstation","stripe","suno","temu","tiktok","tripoai","trustwallet","vercel",
    "walmart","wechat","airbnb","amazon","bookingdotcom","canva","claude","discord","figma","netflix",
    "steam","twitch","youtube","zoom",
  ],
  "terbium-wallet": [
    "openai","abacusai","ableton","adobe","adspy","agoda","amazon-ads","amazonaws","binance","cursor",
    "deepseek","deezer","dhgate","dhl","epicgames","etsy","fiverr","freepik","gitbook","godaddy",
    "google","hetzner","heygen","icloud","iherb","jetbrains","linkedin","midjourney","notion","patreon",
    "paypal","playstation","stripe","suno","temu","tiktok","tripoai","trustwallet","walmart","wechat",
    "amazon","bookingdotcom","canva","claude","discord","elevenlabs","figma","github","netflix","steam",
    "twitch","youtube","zoom",
  ],
  "cardclub": [
    "openai","kling","suno","airbnb","amazon","bookingdotcom","canva","github","midjourney","runway",
    "spotify","tiktok","zoom",
  ],
  "morekart": [
    "openai","abacusai","ableton","adobe","adspy","agoda","amazon-ads","amazonaws","binance","cursor",
    "deepseek","deezer","dhgate","dhl","epicgames","etsy","fiverr","freepik","gitbook","githubcopilot",
    "godaddy","google","hetzner","heygen","icloud","iherb","jetbrains","linkedin","midjourney","notion",
    "patreon","paypal","playstation","stripe","suno","temu","tiktok","tripoai","trustwallet","walmart",
    "wechat","airbnb","amazon","bookingdotcom","canva","claude","figma","netflix","spotify","steam",
    "twitch","youtube","zoom",
  ],
};

/**
 * Real per-card service list. No synthetic catalog slices — only data we can
 * confirm: the explicit `CARD_REAL_SERVICES` set, or the card's own
 * `top_services` column, otherwise empty.
 */
export function getCardServiceSlugs(
  cardSlug: string,
  topServices: readonly string[] | null | undefined = null,
): string[] {
  const source = CARD_REAL_SERVICES[cardSlug] ?? topServices ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of source) {
    if (!slug || seen.has(slug)) continue;
    if (!SERVICES_BY_SLUG[slug]) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

export function getCardServiceCount(
  cardSlug: string,
  topServices: readonly string[] | null | undefined = null,
): number {
  return getCardServiceSlugs(cardSlug, topServices).length;
}

export function getCardServices(
  cardSlug: string,
  topServices: readonly string[] | null | undefined = null,
): Service[] {
  return getCardServiceSlugs(cardSlug, topServices)
    .map((s) => SERVICES_BY_SLUG[s])
    .filter(Boolean);
}

export function iconUrl(service: Service): string {
  return `https://www.google.com/s2/favicons?domain=${service.domain}&sz=64`;
}

const TABLE_PRIORITY_SLUGS: string[] = [
  "openai",
  "netflix",
  "spotify",
  "steam",
  "youtube",
  "adobe",
  "amazon",
  "googleplay",
  "appletv",
  "bookingdotcom",
];

const CRYPTO_CARD_PRIORITY_SLUGS: string[] = [
  "binance",
  "openai",
  "steam",
  "bybit",
  "coinbase",
  "trustwallet",
  "netflix",
  "spotify",
];

function isCryptoCard(cardSlug: string): boolean {
  return isCryptoCardSlug(cardSlug);
}

export function getTableServiceSlugs(
  cardSlug: string,
  allSlugs: string[],
  limit = 4,
): string[] {
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

  for (const p of priority) {
    if (set.has(p) && hasRealIcon(p)) out.push(p);
    if (out.length >= limit) return out;
  }

  const already = new Set(out);
  const isCrypto = (slug: string) => SERVICES_BY_SLUG[slug]?.category === "crypto";

  const nonCryptoRest = unique.filter(
    (s) => !already.has(s) && !isCrypto(s) && hasRealIcon(s),
  );
  for (const s of nonCryptoRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  const cryptoRest = unique.filter(
    (s) => !already.has(s) && isCrypto(s) && hasRealIcon(s) && !out.includes(s),
  );
  for (const s of cryptoRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  const plateRest = unique.filter((s) => !out.includes(s));
  for (const s of plateRest) {
    out.push(s);
    if (out.length >= limit) return out;
  }

  return out;
}
