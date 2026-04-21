// ─── типы ─────────────────────────────────────────────────────────────────────
export type Platform = "steam" | "telegram" | "vk" | "youtube" | "discord" | "tiktok" | "twitter" | "instagram" | "twitch"
export type PlatformLink = { platform: Platform; url: string }
export type BlockType = "text" | "social" | "track" | "banner"

export interface CardBlock {
  id: string
  type: BlockType
  title?: string
  description?: string
  emoji?: string
  links?: PlatformLink[]
  trackTitle?: string
  trackUrl?: string
  bannerText?: string
  bannerImage?: string
}

export interface CardStyle {
  bg: string
  border: string
  hoverBorder: string
  textColor: string
  linkColor: string
}

export interface Card {
  id: number
  size: "small" | "medium" | "large"
  style: CardStyle
  blocks: CardBlock[]
}

export interface SiteData {
  platformName: string
  nickname: string
  profileUrl: string
  cards: Card[]
}

// ─── стиль по умолчанию ───────────────────────────────────────────────────────
export const DEFAULT_STYLE: CardStyle = {
  bg: "#0d0d14",
  border: "#ffffff1a",
  hoverBorder: "#a78bfa",
  textColor: "#ffffff",
  linkColor: "#a78bfa",
}

export const DEFAULT_DATA: SiteData = {
  platformName: "Nebula Ventures",
  nickname: "",
  profileUrl: "",
  cards: [
    {
      id: 1, size: "large", style: { ...DEFAULT_STYLE },
      blocks: [{ id: "b1", type: "banner", bannerText: "✨ Добро пожаловать на мою платформу!", bannerImage: "" }],
    },
    {
      id: 2, size: "large", style: { ...DEFAULT_STYLE },
      blocks: [{ id: "b2", type: "social", title: "Мои платформы", links: [] }],
    },
    {
      id: 3, size: "medium", style: { ...DEFAULT_STYLE },
      blocks: [{ id: "b3", type: "text", title: "Обо мне", emoji: "🚀", description: "Расскажите о себе здесь." }],
    },
    {
      id: 4, size: "large", style: { ...DEFAULT_STYLE },
      blocks: [{ id: "b4", type: "track", trackTitle: "Мой трек", trackUrl: "" }],
    },
  ],
}

// ─── хранилище ────────────────────────────────────────────────────────────────
export function loadData(): SiteData {
  try {
    const raw = localStorage.getItem("nebula_data_v3")
    return raw ? JSON.parse(raw) : DEFAULT_DATA
  } catch { return DEFAULT_DATA }
}
export function saveData(d: SiteData) {
  localStorage.setItem("nebula_data_v3", JSON.stringify(d))
}

// ─── вспомогательные ──────────────────────────────────────────────────────────
export const sizeMap = {
  small:  { label: "Маленькая", cols: "col-span-1",               minH: "min-h-[120px]" },
  medium: { label: "Средняя",   cols: "col-span-1 sm:col-span-2", minH: "min-h-[160px]" },
  large:  { label: "Большая",   cols: "col-span-1 sm:col-span-3", minH: "min-h-[180px]" },
}

export const PLATFORMS: { id: Platform; label: string; color: string; bg: string }[] = [
  { id: "steam",     label: "Steam",       color: "#66c0f4", bg: "#1b2838" },
  { id: "telegram",  label: "Telegram",    color: "#ffffff", bg: "#0088cc" },
  { id: "vk",        label: "ВКонтакте",   color: "#ffffff", bg: "#0077ff" },
  { id: "youtube",   label: "YouTube",     color: "#ffffff", bg: "#ff0000" },
  { id: "discord",   label: "Discord",     color: "#ffffff", bg: "#5865f2" },
  { id: "tiktok",    label: "TikTok",      color: "#ffffff", bg: "#010101" },
  { id: "twitter",   label: "X (Twitter)", color: "#ffffff", bg: "#14171a" },
  { id: "instagram", label: "Instagram",   color: "#ffffff", bg: "#c13584" },
  { id: "twitch",    label: "Twitch",      color: "#ffffff", bg: "#9146ff" },
]
