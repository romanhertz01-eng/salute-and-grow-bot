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
  { slug: "runway", name: "Runway", category: "ai", plate: true },
  { slug: "pika", name: "Pika Labs", category: "ai", plate: true },
  { slug: "krea", name: "Krea", category: "ai", plate: true },
  { slug: "leonardoai", name: "Leonardo AI", category: "ai", plate: true },
  { slug: "ideogram", name: "Ideogram", category: "ai", plate: true },
  { slug: "stability", name: "Stability AI", category: "ai", plate: true },
  { slug: "lumalabs", name: "Luma Labs", category: "ai", plate: true },
  { slug: "hailuo", name: "Hailuo AI", category: "ai", plate: true },
  { slug: "kling", name: "Kling AI", category: "ai", plate: true },
  { slug: "sora", name: "Sora", category: "ai", plate: true },
  { slug: "gamma", name: "Gamma", category: "ai", plate: true },
  { slug: "descript", name: "Descript", category: "ai", plate: true },
  { slug: "otter", name: "Otter.ai", category: "ai", plate: true },
  { slug: "grammarly", name: "Grammarly", category: "ai", plate: true },
  { slug: "jasper", name: "Jasper", category: "ai", plate: true },
  { slug: "copyai", name: "Copy.ai", category: "ai", plate: true },
  { slug: "writesonic", name: "Writesonic", category: "ai", plate: true },
  { slug: "quillbot", name: "QuillBot", category: "ai", plate: true },
  { slug: "deepl", name: "DeepL", category: "ai" },
  { slug: "rev", name: "Rev", category: "ai", plate: true },
  { slug: "fathom", name: "Fathom", category: "ai", plate: true },
  { slug: "fireflies", name: "Fireflies.ai", category: "ai", plate: true },
  { slug: "notta", name: "Notta", category: "ai", plate: true },
  { slug: "tome", name: "Tome", category: "ai", plate: true },
  { slug: "characterai", name: "Character.AI", category: "ai", plate: true },
  { slug: "poe", name: "Poe", category: "ai", plate: true },
  { slug: "huggingface", name: "Hugging Face", category: "ai" },
  { slug: "replicate", name: "Replicate", category: "ai" },
  { slug: "colab", name: "Google Colab", category: "ai" },
  { slug: "kaggle", name: "Kaggle", category: "ai" },
  { slug: "wandb", name: "Weights & Biases", category: "ai" },
  { slug: "langchain", name: "LangChain", category: "ai" },
  { slug: "pinecone", name: "Pinecone", category: "ai", plate: true },
  { slug: "cohere", name: "Cohere", category: "ai", plate: true },
  { slug: "mistralai", name: "Mistral AI", category: "ai", plate: true },
  { slug: "groq", name: "Groq", category: "ai", plate: true },
  { slug: "togetherai", name: "Together AI", category: "ai", plate: true },
  { slug: "tavily", name: "Tavily", category: "ai", plate: true },
  { slug: "phind", name: "Phind", category: "ai", plate: true },
  { slug: "codeium", name: "Codeium", category: "ai", plate: true },
  { slug: "windsurf", name: "Windsurf", category: "ai", plate: true },
  { slug: "zedindustries", name: "Zed", category: "ai", plate: true },
  { slug: "replit", name: "Replit", category: "ai" },
  { slug: "stackblitz", name: "StackBlitz", category: "ai" },
  { slug: "codesandbox", name: "CodeSandbox", category: "ai" },
  { slug: "bolt", name: "Bolt.new", category: "ai", plate: true },
  { slug: "lovable", name: "Lovable", category: "ai", plate: true },
  { slug: "warp", name: "Warp", category: "ai", plate: true },
  // streaming
  { slug: "netflix", name: "Netflix", category: "streaming" },
  { slug: "spotify", name: "Spotify", category: "streaming" },
  { slug: "appletv", name: "Apple TV+", category: "streaming" },
  { slug: "deezer", name: "Deezer", category: "streaming" },
  { slug: "youtube", name: "YouTube Premium", category: "streaming" },
  { slug: "hbo", name: "HBO Max", category: "streaming", plate: true },
  { slug: "disneyplus", name: "Disney+", category: "streaming" },
  { slug: "hulu", name: "Hulu", category: "streaming" },
  { slug: "primevideo", name: "Prime Video", category: "streaming" },
  { slug: "paramountplus", name: "Paramount+", category: "streaming" },
  { slug: "peacock", name: "Peacock TV", category: "streaming" },
  { slug: "crunchyroll", name: "Crunchyroll", category: "streaming" },
  { slug: "funimation", name: "Funimation", category: "streaming", plate: true },
  { slug: "mubi", name: "MUBI", category: "streaming", plate: true },
  { slug: "curiositystream", name: "CuriosityStream", category: "streaming", plate: true },
  { slug: "plutotv", name: "Pluto TV", category: "streaming", plate: true },
  { slug: "tubi", name: "Tubi", category: "streaming", plate: true },
  { slug: "dazn", name: "DAZN", category: "streaming", plate: true },
  { slug: "fubotv", name: "FuboTV", category: "streaming", plate: true },
  { slug: "sling", name: "Sling TV", category: "streaming", plate: true },
  { slug: "applemusic", name: "Apple Music", category: "streaming" },
  { slug: "tidal", name: "Tidal", category: "streaming", plate: true },
  { slug: "pandora", name: "Pandora", category: "streaming" },
  { slug: "soundcloud", name: "SoundCloud", category: "streaming" },
  { slug: "amazonmusic", name: "Amazon Music", category: "streaming" },
  { slug: "audible", name: "Audible", category: "streaming" },
  { slug: "scribd", name: "Scribd", category: "streaming" },
  { slug: "twitch", name: "Twitch", category: "streaming" },
  { slug: "kick", name: "Kick", category: "streaming", plate: true },
  { slug: "vimeo", name: "Vimeo", category: "streaming" },
  { slug: "dailymotion", name: "Dailymotion", category: "streaming" },
  { slug: "napster", name: "Napster", category: "streaming", plate: true },
  { slug: "iheartradio", name: "iHeartRadio", category: "streaming", plate: true },
  { slug: "bandcamp", name: "Bandcamp", category: "streaming" },
  { slug: "beatport", name: "Beatport", category: "streaming", plate: true },
  { slug: "qobuz", name: "Qobuz", category: "streaming", plate: true },
  { slug: "shazam", name: "Shazam", category: "streaming" },
  { slug: "patreon", name: "Patreon", category: "streaming" },
  { slug: "onlyfans", name: "OnlyFans", category: "streaming", plate: true },
  { slug: "substack", name: "Substack", category: "streaming" },
  // shops
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
  { slug: "shein", name: "SHEIN", category: "shops", plate: true },
  { slug: "wish", name: "Wish", category: "shops", plate: true },
  { slug: "target", name: "Target", category: "shops", plate: true },
  { slug: "bestbuy", name: "Best Buy", category: "shops", plate: true },
  { slug: "costco", name: "Costco", category: "shops", plate: true },
  { slug: "nike", name: "Nike", category: "shops" },
  { slug: "adidas", name: "Adidas", category: "shops" },
  { slug: "zara", name: "Zara", category: "shops", plate: true },
  { slug: "hm", name: "H&M", category: "shops", plate: true },
  { slug: "uniqlo", name: "UNIQLO", category: "shops", plate: true },
  { slug: "gap", name: "Gap", category: "shops", plate: true },
  { slug: "levis", name: "Levi's", category: "shops", plate: true },
  { slug: "puma", name: "Puma", category: "shops" },
  { slug: "newbalance", name: "New Balance", category: "shops", plate: true },
  { slug: "reebok", name: "Reebok", category: "shops", plate: true },
  { slug: "underarmour", name: "Under Armour", category: "shops", plate: true },
  { slug: "northface", name: "The North Face", category: "shops", plate: true },
  { slug: "patagonia", name: "Patagonia", category: "shops", plate: true },
  { slug: "lululemon", name: "Lululemon", category: "shops", plate: true },
  { slug: "gucci", name: "Gucci", category: "shops", plate: true },
  { slug: "prada", name: "Prada", category: "shops", plate: true },
  { slug: "louisvuitton", name: "Louis Vuitton", category: "shops", plate: true },
  { slug: "chanel", name: "Chanel", category: "shops", plate: true },
  { slug: "hermes", name: "Hermès", category: "shops", plate: true },
  { slug: "burberry", name: "Burberry", category: "shops", plate: true },
  { slug: "apple", name: "Apple Store", category: "shops" },
  { slug: "samsung", name: "Samsung Shop", category: "shops" },
  { slug: "dyson", name: "Dyson", category: "shops", plate: true },
  { slug: "bosch", name: "Bosch", category: "shops" },
  { slug: "lego", name: "LEGO", category: "shops", plate: true },
  { slug: "hasbro", name: "Hasbro", category: "shops", plate: true },
  { slug: "mattel", name: "Mattel", category: "shops", plate: true },
  { slug: "ikea", name: "IKEA", category: "shops", plate: true },
  { slug: "wayfair", name: "Wayfair", category: "shops", plate: true },
  { slug: "homedepot", name: "Home Depot", category: "shops", plate: true },
  { slug: "lowes", name: "Lowe's", category: "shops", plate: true },
  { slug: "sephora", name: "Sephora", category: "shops", plate: true },
  { slug: "ulta", name: "Ulta Beauty", category: "shops", plate: true },
  { slug: "macys", name: "Macy's", category: "shops", plate: true },
  { slug: "nordstrom", name: "Nordstrom", category: "shops", plate: true },
  { slug: "asos", name: "ASOS", category: "shops", plate: true },
  { slug: "farfetch", name: "Farfetch", category: "shops", plate: true },
  { slug: "mytheresa", name: "Mytheresa", category: "shops", plate: true },
  { slug: "net-a-porter", name: "Net-a-Porter", category: "shops", plate: true },
  { slug: "yoox", name: "YOOX", category: "shops", plate: true },
  { slug: "mrporter", name: "Mr Porter", category: "shops", plate: true },
  { slug: "ssense", name: "SSENSE", category: "shops", plate: true },
  { slug: "stockx", name: "StockX", category: "shops", plate: true },
  { slug: "goat", name: "GOAT", category: "shops", plate: true },
  { slug: "grailed", name: "Grailed", category: "shops", plate: true },
  { slug: "depop", name: "Depop", category: "shops", plate: true },
  { slug: "vinted", name: "Vinted", category: "shops", plate: true },
  { slug: "mercari", name: "Mercari", category: "shops", plate: true },
  { slug: "poshmark", name: "Poshmark", category: "shops", plate: true },
  { slug: "thredup", name: "thredUP", category: "shops", plate: true },
  // games
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
  { slug: "gog", name: "GOG.com", category: "games", plate: true },
  { slug: "origin", name: "EA App / Origin", category: "games", plate: true },
  { slug: "ubisoft", name: "Ubisoft Connect", category: "games" },
  { slug: "battlenet", name: "Battle.net", category: "games", plate: true },
  { slug: "rockstargames", name: "Rockstar Games", category: "games" },
  { slug: "riotgames", name: "Riot Games", category: "games" },
  { slug: "gamejolt", name: "Game Jolt", category: "games", plate: true },
  { slug: "itchdotio", name: "itch.io", category: "games" },
  { slug: "humblebundle", name: "Humble Bundle", category: "games" },
  { slug: "greenmangaming", name: "Green Man Gaming", category: "games", plate: true },
  { slug: "gamesplanet", name: "Gamesplanet", category: "games", plate: true },
  { slug: "fanatical", name: "Fanatical", category: "games", plate: true },
  { slug: "g2a", name: "G2A", category: "games", plate: true },
  { slug: "kinguin", name: "Kinguin", category: "games", plate: true },
  { slug: "eneba", name: "Eneba", category: "games", plate: true },
  { slug: "cdkeys", name: "CDKeys", category: "games", plate: true },
  { slug: "gamivo", name: "Gamivo", category: "games", plate: true },
  { slug: "k4g", name: "K4G", category: "games", plate: true },
  { slug: "mmoga", name: "MMOGA", category: "games", plate: true },
  { slug: "driffle", name: "Driffle", category: "games", plate: true },
  { slug: "robuxstore", name: "Roblox", category: "games" },
  { slug: "minecraft", name: "Minecraft", category: "games" },
  { slug: "mihoyo", name: "miHoYo", category: "games", plate: true },
  { slug: "hoyoverse", name: "HoYoverse", category: "games", plate: true },
  { slug: "blizzard", name: "Blizzard", category: "games" },
  { slug: "supercell", name: "Supercell", category: "games", plate: true },
  { slug: "garena", name: "Garena", category: "games", plate: true },
  { slug: "krafton", name: "Krafton", category: "games", plate: true },
  { slug: "nexon", name: "Nexon", category: "games", plate: true },
  { slug: "gameflip", name: "Gameflip", category: "games", plate: true },
  { slug: "razer", name: "Razer Gold", category: "games" },
  // ads
  { slug: "googleads", name: "Google Ads", category: "ads" },
  { slug: "tiktok", name: "TikTok Ads", category: "ads" },
  { slug: "meta", name: "Meta Ads", category: "ads" },
  { slug: "amazon-ads", name: "Amazon Ads", category: "ads", plate: true },
  { slug: "adspy", name: "ADSPY", category: "ads", plate: true },
  { slug: "microsoftads", name: "Microsoft Ads", category: "ads", plate: true },
  { slug: "linkedin", name: "LinkedIn Ads", category: "ads" },
  { slug: "twitterads", name: "X Ads", category: "ads", plate: true },
  { slug: "pinterest", name: "Pinterest Ads", category: "ads" },
  { slug: "snapchat", name: "Snapchat Ads", category: "ads" },
  { slug: "redditads", name: "Reddit Ads", category: "ads", plate: true },
  { slug: "quorads", name: "Quora Ads", category: "ads" },
  { slug: "bingads", name: "Bing Ads", category: "ads", plate: true },
  { slug: "outbrain", name: "Outbrain", category: "ads", plate: true },
  { slug: "taboola", name: "Taboola", category: "ads", plate: true },
  { slug: "criteo", name: "Criteo", category: "ads", plate: true },
  { slug: "adroll", name: "AdRoll", category: "ads", plate: true },
  { slug: "semrush", name: "Semrush", category: "ads", plate: true },
  { slug: "ahrefs", name: "Ahrefs", category: "ads", plate: true },
  { slug: "similarweb", name: "Similarweb", category: "ads", plate: true },
  { slug: "moz", name: "Moz", category: "ads", plate: true },
  { slug: "hubspot", name: "HubSpot", category: "ads" },
  { slug: "mailchimp", name: "Mailchimp", category: "ads", plate: true },
  { slug: "klaviyo", name: "Klaviyo", category: "ads", plate: true },
  // travel
  { slug: "bookingdotcom", name: "Booking", category: "travel" },
  { slug: "airbnb", name: "Airbnb", category: "travel" },
  { slug: "agoda", name: "Agoda", category: "travel" },
  { slug: "deutschebahn", name: "Deutsche Bahn", category: "travel", plate: true },
  { slug: "viagogo", name: "Viagogo", category: "travel", plate: true },
  { slug: "ticketmaster", name: "Ticketmaster", category: "travel" },
  { slug: "uber", name: "Uber", category: "travel" },
  { slug: "expedia", name: "Expedia", category: "travel" },
  { slug: "hotels", name: "Hotels.com", category: "travel", plate: true },
  { slug: "kayak", name: "Kayak", category: "travel", plate: true },
  { slug: "skyscanner", name: "Skyscanner", category: "travel" },
  { slug: "trivago", name: "Trivago", category: "travel", plate: true },
  { slug: "hostelworld", name: "Hostelworld", category: "travel", plate: true },
  { slug: "vrbo", name: "Vrbo", category: "travel", plate: true },
  { slug: "marriott", name: "Marriott", category: "travel", plate: true },
  { slug: "hilton", name: "Hilton", category: "travel", plate: true },
  { slug: "hyatt", name: "Hyatt", category: "travel", plate: true },
  { slug: "ihg", name: "IHG", category: "travel", plate: true },
  { slug: "accor", name: "Accor", category: "travel", plate: true },
  { slug: "radisson", name: "Radisson", category: "travel", plate: true },
  { slug: "wizzair", name: "Wizz Air", category: "travel", plate: true },
  { slug: "ryanair", name: "Ryanair", category: "travel", plate: true },
  { slug: "easyjet", name: "easyJet", category: "travel", plate: true },
  { slug: "lufthansa", name: "Lufthansa", category: "travel", plate: true },
  { slug: "britishairways", name: "British Airways", category: "travel", plate: true },
  { slug: "airfrance", name: "Air France", category: "travel", plate: true },
  { slug: "klm", name: "KLM", category: "travel", plate: true },
  { slug: "emirates", name: "Emirates", category: "travel", plate: true },
  { slug: "qatarairways", name: "Qatar Airways", category: "travel", plate: true },
  { slug: "turkishairlines", name: "Turkish Airlines", category: "travel", plate: true },
  { slug: "americanairlines", name: "American Airlines", category: "travel", plate: true },
  { slug: "united", name: "United Airlines", category: "travel", plate: true },
  { slug: "delta", name: "Delta Air Lines", category: "travel", plate: true },
  { slug: "southwest", name: "Southwest Airlines", category: "travel", plate: true },
  { slug: "jetblue", name: "JetBlue", category: "travel", plate: true },
  { slug: "alaskaairlines", name: "Alaska Airlines", category: "travel", plate: true },
  { slug: "aeromexico", name: "Aeromexico", category: "travel", plate: true },
  { slug: "latam", name: "LATAM Airlines", category: "travel", plate: true },
  { slug: "ana", name: "ANA", category: "travel", plate: true },
  { slug: "singaporeair", name: "Singapore Airlines", category: "travel", plate: true },
  { slug: "cathay", name: "Cathay Pacific", category: "travel", plate: true },
  { slug: "koreanair", name: "Korean Air", category: "travel", plate: true },
  { slug: "lyft", name: "Lyft", category: "travel" },
  { slug: "bolt-travel", name: "Bolt Rides", category: "travel", plate: true },
  { slug: "gett", name: "Gett", category: "travel", plate: true },
  { slug: "didi", name: "DiDi", category: "travel", plate: true },
  { slug: "grab", name: "Grab", category: "travel", plate: true },
  { slug: "ola", name: "Ola Cabs", category: "travel", plate: true },
  { slug: "flixbus", name: "FlixBus", category: "travel", plate: true },
  { slug: "omio", name: "Omio", category: "travel", plate: true },
  { slug: "rome2rio", name: "Rome2Rio", category: "travel", plate: true },
  { slug: "trainline", name: "Trainline", category: "travel", plate: true },
  { slug: "eurail", name: "Eurail", category: "travel", plate: true },
  { slug: "getyourguide", name: "GetYourGuide", category: "travel", plate: true },
  { slug: "viator", name: "Viator", category: "travel", plate: true },
  { slug: "klook", name: "Klook", category: "travel", plate: true },
  { slug: "tripcom", name: "Trip.com", category: "travel", plate: true },
  { slug: "tripadvisor", name: "Tripadvisor", category: "travel" },
  { slug: "stubhub", name: "StubHub", category: "travel", plate: true },
  { slug: "seatgeek", name: "SeatGeek", category: "travel", plate: true },
  { slug: "axs", name: "AXS", category: "travel", plate: true },
  // work
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
  { slug: "slack", name: "Slack", category: "work" },
  { slug: "trello", name: "Trello", category: "work" },
  { slug: "asana", name: "Asana", category: "work" },
  { slug: "monday", name: "Monday.com", category: "work" },
  { slug: "clickup", name: "ClickUp", category: "work" },
  { slug: "linear", name: "Linear", category: "work" },
  { slug: "jira", name: "Jira", category: "work" },
  { slug: "confluence", name: "Confluence", category: "work" },
  { slug: "miro", name: "Miro", category: "work" },
  { slug: "mural", name: "Mural", category: "work", plate: true },
  { slug: "loom", name: "Loom", category: "work" },
  { slug: "zoom", name: "Zoom", category: "work" },
  { slug: "googlemeet", name: "Google Meet", category: "work" },
  { slug: "webex", name: "Webex", category: "work", plate: true },
  { slug: "dropbox", name: "Dropbox", category: "work" },
  { slug: "box", name: "Box", category: "work", plate: true },
  { slug: "googledrive", name: "Google Drive", category: "work" },
  { slug: "onedrive", name: "OneDrive", category: "work", plate: true },
  { slug: "pcloud", name: "pCloud", category: "work", plate: true },
  { slug: "mega", name: "MEGA", category: "work", plate: true },
  { slug: "gitlab", name: "GitLab", category: "work" },
  { slug: "bitbucket", name: "Bitbucket", category: "work" },
  { slug: "codeberg", name: "Codeberg", category: "work" },
  { slug: "gitea", name: "Gitea", category: "work" },
  { slug: "sentry", name: "Sentry", category: "work" },
  { slug: "datadoghq", name: "Datadog", category: "work" },
  { slug: "newrelic", name: "New Relic", category: "work", plate: true },
  { slug: "posthog", name: "PostHog", category: "work" },
  { slug: "mixpanel", name: "Mixpanel", category: "work", plate: true },
  { slug: "amplitude", name: "Amplitude", category: "work", plate: true },
  { slug: "segment", name: "Segment", category: "work", plate: true },
  { slug: "googlecloud", name: "Google Cloud", category: "work" },
  { slug: "microsoftazure", name: "Microsoft Azure", category: "work", plate: true },
  { slug: "digitalocean", name: "DigitalOcean", category: "work" },
  { slug: "linode", name: "Linode", category: "work", plate: true },
  { slug: "vultr", name: "Vultr", category: "work", plate: true },
  { slug: "ovh", name: "OVHcloud", category: "work" },
  { slug: "scaleway", name: "Scaleway", category: "work", plate: true },
  { slug: "netlify", name: "Netlify", category: "work" },
  { slug: "render", name: "Render", category: "work", plate: true },
  { slug: "railway", name: "Railway", category: "work", plate: true },
  { slug: "fly", name: "Fly.io", category: "work", plate: true },
  { slug: "supabase", name: "Supabase", category: "work" },
  { slug: "firebase", name: "Firebase", category: "work", plate: true },
  { slug: "planetscale", name: "PlanetScale", category: "work", plate: true },
  { slug: "neondatabase", name: "Neon", category: "work", plate: true },
  { slug: "upstash", name: "Upstash", category: "work", plate: true },
  { slug: "mongodb", name: "MongoDB Atlas", category: "work" },
  { slug: "redis", name: "Redis Cloud", category: "work" },
  { slug: "sendgrid", name: "SendGrid", category: "work", plate: true },
  { slug: "mailgun", name: "Mailgun", category: "work", plate: true },
  { slug: "postmark", name: "Postmark", category: "work", plate: true },
  { slug: "resend", name: "Resend", category: "work", plate: true },
  { slug: "namecheap", name: "Namecheap", category: "work" },
  { slug: "namesilo", name: "NameSilo", category: "work", plate: true },
  { slug: "porkbun", name: "Porkbun", category: "work", plate: true },
  { slug: "hover", name: "Hover", category: "work", plate: true },
  { slug: "dnsimple", name: "DNSimple", category: "work", plate: true },
  { slug: "shopify", name: "Shopify", category: "work" },
  { slug: "wix", name: "Wix", category: "work" },
  { slug: "squarespace", name: "Squarespace", category: "work" },
  { slug: "webflow", name: "Webflow", category: "work" },
  { slug: "framer", name: "Framer", category: "work" },
  { slug: "wordpress", name: "WordPress.com", category: "work" },
  { slug: "ghost", name: "Ghost", category: "work" },
  { slug: "bubble", name: "Bubble", category: "work", plate: true },
  { slug: "airtable", name: "Airtable", category: "work" },
  { slug: "zapier", name: "Zapier", category: "work" },
  { slug: "make", name: "Make", category: "work" },
  { slug: "ifttt", name: "IFTTT", category: "work" },
  { slug: "n8n", name: "n8n", category: "work" },
  { slug: "coursera", name: "Coursera", category: "work" },
  { slug: "udemy", name: "Udemy", category: "work" },
  { slug: "edx", name: "edX", category: "work" },
  { slug: "skillshare", name: "Skillshare", category: "work", plate: true },
  { slug: "masterclass", name: "MasterClass", category: "work", plate: true },
  { slug: "duolingo", name: "Duolingo", category: "work" },
  { slug: "babbel", name: "Babbel", category: "work", plate: true },
  { slug: "busuu", name: "Busuu", category: "work", plate: true },
  { slug: "codecademy", name: "Codecademy", category: "work", plate: true },
  { slug: "pluralsight", name: "Pluralsight", category: "work" },
  { slug: "linkedinlearning", name: "LinkedIn Learning", category: "work", plate: true },
  { slug: "khanacademy", name: "Khan Academy", category: "work" },
  { slug: "brilliant", name: "Brilliant", category: "work", plate: true },
  { slug: "elsa", name: "ELSA Speak", category: "work", plate: true },
  { slug: "1password", name: "1Password", category: "work" },
  { slug: "bitwarden", name: "Bitwarden", category: "work" },
  { slug: "lastpass", name: "LastPass", category: "work", plate: true },
  { slug: "dashlane", name: "Dashlane", category: "work", plate: true },
  { slug: "proton", name: "Proton", category: "work" },
  { slug: "protonmail", name: "ProtonMail", category: "work" },
  { slug: "tuta", name: "Tuta", category: "work", plate: true },
  { slug: "fastmail", name: "Fastmail", category: "work", plate: true },
  { slug: "hey", name: "Hey", category: "work", plate: true },
  { slug: "basecamp", name: "Basecamp", category: "work", plate: true },
  { slug: "todoist", name: "Todoist", category: "work", plate: true },
  { slug: "things", name: "Things", category: "work", plate: true },
  { slug: "evernote", name: "Evernote", category: "work" },
  { slug: "obsidian", name: "Obsidian", category: "work", plate: true },
  { slug: "bear", name: "Bear", category: "work", plate: true },
  { slug: "readwise", name: "Readwise", category: "work", plate: true },
  { slug: "raindrop", name: "Raindrop.io", category: "work", plate: true },
  { slug: "calendly", name: "Calendly", category: "work", plate: true },
  { slug: "cal", name: "Cal.com", category: "work", plate: true },
  { slug: "doodle", name: "Doodle", category: "work", plate: true },
  { slug: "typeform", name: "Typeform", category: "work", plate: true },
  { slug: "surveymonkey", name: "SurveyMonkey", category: "work", plate: true },
  { slug: "intercom", name: "Intercom", category: "work" },
  { slug: "zendesk", name: "Zendesk", category: "work" },
  { slug: "freshdesk", name: "Freshdesk", category: "work", plate: true },
  { slug: "crisp", name: "Crisp", category: "work", plate: true },
  { slug: "drift", name: "Drift", category: "work", plate: true },
  { slug: "hootsuite", name: "Hootsuite", category: "work", plate: true },
  { slug: "buffer", name: "Buffer", category: "work" },
  { slug: "later", name: "Later", category: "work", plate: true },
  { slug: "sproutsocial", name: "Sprout Social", category: "work", plate: true },
  // crypto
  { slug: "binance", name: "Binance", category: "crypto" },
  { slug: "trustwallet", name: "Trust Wallet", category: "crypto", plate: true },
  { slug: "coinbase", name: "Coinbase", category: "crypto", plate: true },
  { slug: "bybit", name: "Bybit", category: "crypto", plate: true },
  { slug: "kraken", name: "Kraken", category: "crypto", plate: true },
  { slug: "okx", name: "OKX", category: "crypto", plate: true },
  { slug: "kucoin", name: "KuCoin", category: "crypto", plate: true },
  { slug: "bitget", name: "Bitget", category: "crypto", plate: true },
  { slug: "mexc", name: "MEXC", category: "crypto", plate: true },
  { slug: "gateio", name: "Gate.io", category: "crypto", plate: true },
  { slug: "bitstamp", name: "Bitstamp", category: "crypto", plate: true },
  { slug: "crypto", name: "Crypto.com", category: "crypto", plate: true },
  { slug: "bitfinex", name: "Bitfinex", category: "crypto", plate: true },
  { slug: "gemini", name: "Gemini", category: "crypto", plate: true },
  { slug: "htx", name: "HTX", category: "crypto", plate: true },
  { slug: "uniswap", name: "Uniswap", category: "crypto", plate: true },
  { slug: "pancakeswap", name: "PancakeSwap", category: "crypto", plate: true },
  { slug: "metamask", name: "MetaMask", category: "crypto", plate: true },
  { slug: "phantom", name: "Phantom", category: "crypto", plate: true },
  { slug: "ledger", name: "Ledger", category: "crypto", plate: true },
  { slug: "trezor", name: "Trezor", category: "crypto", plate: true },
  { slug: "exodus", name: "Exodus", category: "crypto", plate: true },
  { slug: "blockchaindotcom", name: "Blockchain.com", category: "crypto", plate: true },
  { slug: "etherscan", name: "Etherscan", category: "crypto", plate: true },
  { slug: "tronscan", name: "Tronscan", category: "crypto", plate: true },
  { slug: "polygon", name: "Polygon", category: "crypto", plate: true },
  { slug: "chainlink", name: "Chainlink", category: "crypto", plate: true },
  { slug: "solana", name: "Solana", category: "crypto" },
  { slug: "ethereum", name: "Ethereum", category: "crypto" },
  { slug: "bitcoin", name: "Bitcoin", category: "crypto" },
  // messengers
  { slug: "wechat", name: "WeChat", category: "messengers" },
  { slug: "discord", name: "Discord", category: "messengers" },
  { slug: "icloud", name: "iCloud", category: "messengers" },
  { slug: "microsoft", name: "Microsoft Store", category: "messengers" },
  { slug: "telegram", name: "Telegram Premium", category: "messengers" },
  { slug: "whatsapp", name: "WhatsApp Business", category: "messengers" },
  { slug: "signal", name: "Signal", category: "messengers" },
  { slug: "viber", name: "Viber", category: "messengers" },
  { slug: "line", name: "LINE", category: "messengers" },
  { slug: "kakaotalk", name: "KakaoTalk", category: "messengers", plate: true },
  { slug: "skype", name: "Skype", category: "messengers" },
  { slug: "nordvpn", name: "NordVPN", category: "messengers" },
  { slug: "expressvpn", name: "ExpressVPN", category: "messengers", plate: true },
  { slug: "surfshark", name: "Surfshark", category: "messengers", plate: true },
  { slug: "protonvpn", name: "Proton VPN", category: "messengers" },
  { slug: "mullvad", name: "Mullvad", category: "messengers", plate: true },
  { slug: "windscribe", name: "Windscribe", category: "messengers", plate: true },
  { slug: "cyberghost", name: "CyberGhost", category: "messengers", plate: true },
  { slug: "ipvanish", name: "IPVanish", category: "messengers", plate: true },
  { slug: "privateinternetaccess", name: "PIA", category: "messengers", plate: true },
  { slug: "mailboxdotorg", name: "Mailbox.org", category: "messengers", plate: true },
  { slug: "gmx", name: "GMX", category: "messengers", plate: true },
  { slug: "yandex", name: "Yandex Plus", category: "messengers", plate: true },
  { slug: "microsoft365", name: "Microsoft 365", category: "messengers", plate: true },
  { slug: "google-workspace", name: "Google Workspace", category: "messengers", plate: true },
  { slug: "apple-icloud", name: "Apple One", category: "messengers", plate: true },
  { slug: "mega-cloud", name: "MEGA Cloud", category: "messengers", plate: true },
  { slug: "backblaze", name: "Backblaze", category: "messengers", plate: true },
  { slug: "sync", name: "Sync.com", category: "messengers", plate: true },
  { slug: "tresorit", name: "Tresorit", category: "messengers", plate: true },
  { slug: "nordpass", name: "NordPass", category: "messengers", plate: true },
  { slug: "keepassxc", name: "KeePassXC", category: "messengers", plate: true },
  { slug: "authy", name: "Authy", category: "messengers", plate: true },
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

/**
 * Deterministic per-card service list.
 *
 * The length is authoritative and comes from `CARD_SERVICE_COUNTS` when the
 * card is known. When the caller passes a count for an unknown card we honor
 * it as a fallback so old code paths keep working.
 */
export function getCardServiceSlugs(cardSlug: string, fallbackCount = 0): string[] {
  const target = CARD_SERVICE_COUNTS[cardSlug] ?? fallbackCount;
  const n = Math.min(Math.max(target, 0), SERVICES.length);
  if (n === 0) return [];
  const order = isCryptoCardSlug(cardSlug) ? CRYPTO_ORDER : DEFAULT_ORDER;
  return order.slice(0, n);
}

export function getCardServiceCount(cardSlug: string, fallbackCount = 0): number {
  return CARD_SERVICE_COUNTS[cardSlug] ?? fallbackCount;
}

export function getCardServices(cardSlug: string, fallbackCount = 0): Service[] {
  return getCardServiceSlugs(cardSlug, fallbackCount)
    .map((s) => SERVICES_BY_SLUG[s])
    .filter(Boolean);
}

export function simpleIconUrl(slug: string): string {
  return `https://cdn.simpleicons.org/${slug}`;
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
