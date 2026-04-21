import { StarField } from "@/components/StarField"
import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

// ─── типы ────────────────────────────────────────────────────────────────────
type Platform = "steam" | "telegram" | "vk" | "youtube" | "discord" | "tiktok" | "twitter" | "instagram" | "twitch"

type PlatformLink = { platform: Platform; url: string }

type CardType = "text" | "social" | "track" | "banner"

interface Card {
  id: number
  type: CardType
  size: "small" | "medium" | "large"
  // text
  title?: string
  description?: string
  emoji?: string
  // social
  links?: PlatformLink[]
  // track
  trackTitle?: string
  trackUrl?: string
  // banner
  bannerText?: string
  bannerImage?: string // base64 или url
}

interface SiteData {
  platformName: string
  nickname: string
  profileUrl: string
  cards: Card[]
}

// ─── начальные данные ─────────────────────────────────────────────────────────
const DEFAULT_DATA: SiteData = {
  platformName: "Nebula Ventures",
  nickname: "",
  profileUrl: "",
  cards: [
    {
      id: 1, type: "banner", size: "large",
      bannerText: "✨ Добро пожаловать на мою платформу!",
      bannerImage: "",
    },
    {
      id: 2, type: "social", size: "large",
      title: "Мои платформы",
      links: [],
    },
    {
      id: 3, type: "text", size: "medium",
      title: "Обо мне", emoji: "🚀",
      description: "Расскажите о себе здесь.",
    },
    {
      id: 4, type: "track", size: "large",
      trackTitle: "Мой трек", trackUrl: "",
    },
  ],
}

// ─── хранилище ───────────────────────────────────────────────────────────────
function loadData(): SiteData {
  try {
    const raw = localStorage.getItem("nebula_data_v2")
    return raw ? JSON.parse(raw) : DEFAULT_DATA
  } catch { return DEFAULT_DATA }
}
function saveData(d: SiteData) {
  localStorage.setItem("nebula_data_v2", JSON.stringify(d))
}

// ─── размеры ──────────────────────────────────────────────────────────────────
const sizeMap = {
  small:  { label: "Маленькая", cols: "col-span-1",           minH: "min-h-[120px]" },
  medium: { label: "Средняя",   cols: "col-span-1 sm:col-span-2", minH: "min-h-[160px]" },
  large:  { label: "Большая",   cols: "col-span-1 sm:col-span-3", minH: "min-h-[180px]" },
}

// ─── платформы ────────────────────────────────────────────────────────────────
const PLATFORMS: { id: Platform; label: string; color: string; bg: string }[] = [
  { id: "steam",     label: "Steam",     color: "#66c0f4", bg: "#1b2838" },
  { id: "telegram",  label: "Telegram",  color: "#ffffff", bg: "#0088cc" },
  { id: "vk",        label: "ВКонтакте", color: "#ffffff", bg: "#0077ff" },
  { id: "youtube",   label: "YouTube",   color: "#ffffff", bg: "#ff0000" },
  { id: "discord",   label: "Discord",   color: "#ffffff", bg: "#5865f2" },
  { id: "tiktok",    label: "TikTok",    color: "#ffffff", bg: "#010101" },
  { id: "twitter",   label: "X (Twitter)", color: "#ffffff", bg: "#14171a" },
  { id: "instagram", label: "Instagram", color: "#ffffff", bg: "#c13584" },
  { id: "twitch",    label: "Twitch",    color: "#ffffff", bg: "#9146ff" },
]

// ─── SVG иконки соцсетей ──────────────────────────────────────────────────────
function PlatformSvg({ id, size = 22 }: { id: Platform; size?: number }) {
  const s = size
  if (id === "steam") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>
  if (id === "telegram") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  if (id === "vk") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.169-.407.44-.407h2.743c.372 0 .508.203.508.643v3.473c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.607 2.168-3.607.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/></svg>
  if (id === "youtube") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  if (id === "discord") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.11 18.1.127 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
  if (id === "tiktok") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  if (id === "twitter") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
  if (id === "instagram") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  if (id === "twitch") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
  return null
}

// ─── Обёртка плашки ───────────────────────────────────────────────────────────
function CardShell({
  card, isAdmin, onDelete, children, className = ""
}: {
  card: Card; isAdmin: boolean; onDelete: (id: number) => void; children: React.ReactNode; className?: string
}) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20 ${sizeMap[card.size].cols} ${sizeMap[card.size].minH} ${className}`}>
      {isAdmin && (
        <button
          onClick={() => onDelete(card.id)}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/40 hover:bg-red-500/40 text-white/50 hover:text-red-300 transition-all"
          title="Удалить"
        >
          <Icon name="Trash2" size={13} />
        </button>
      )}
      {children}
    </div>
  )
}

// ─── Баннерная плашка ─────────────────────────────────────────────────────────
function BannerCard({ card, isAdmin, onUpdate, onDelete }: { card: Card; isAdmin: boolean; onUpdate: (c: Card) => void; onDelete: (id: number) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onUpdate({ ...card, bannerImage: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <CardShell card={card} isAdmin={isAdmin} onDelete={onDelete}>
      <div
        className="w-full h-full flex flex-col items-center justify-center p-5 gap-3 min-h-[inherit]"
        style={card.bannerImage ? { backgroundImage: `url(${card.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))" }}
      >
        {card.bannerImage && <div className="absolute inset-0 bg-black/40" />}
        <p className="relative z-1 text-purple-200 text-sm font-medium text-center px-4">
          {isAdmin ? (
            <input
              value={card.bannerText ?? ""}
              onChange={e => onUpdate({ ...card, bannerText: e.target.value })}
              className="bg-transparent text-purple-200 text-sm font-medium text-center outline-none border-b border-purple-400/40 pb-0.5 w-full min-w-[180px]"
              placeholder="Текст баннера..."
            />
          ) : (
            card.bannerText
          )}
        </p>
        {isAdmin && (
          <div className="relative z-1 flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 text-xs transition-all"
            >
              <Icon name="ImagePlus" size={13} />
              {card.bannerImage ? "Заменить фото" : "Добавить фото"}
            </button>
            {card.bannerImage && (
              <button
                onClick={() => onUpdate({ ...card, bannerImage: "" })}
                className="px-3 py-1.5 bg-white/10 hover:bg-red-500/30 rounded-lg text-white/50 hover:text-red-300 text-xs transition-all"
              >
                Убрать
              </button>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </div>
    </CardShell>
  )
}

// ─── Плашка соцсетей (иконки) ─────────────────────────────────────────────────
function SocialCard({ card, isAdmin, onUpdate, onDelete }: { card: Card; isAdmin: boolean; onUpdate: (c: Card) => void; onDelete: (id: number) => void }) {
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null)
  const [urlDraft, setUrlDraft] = useState("")

  const links: PlatformLink[] = card.links ?? []

  const hasLink = (p: Platform) => links.find(l => l.platform === p)?.url ?? ""

  const togglePlatform = (p: Platform) => {
    if (!isAdmin) return
    const existing = links.find(l => l.platform === p)
    if (existing) {
      setEditingPlatform(p)
      setUrlDraft(existing.url)
    } else {
      setEditingPlatform(p)
      setUrlDraft("")
    }
  }

  const saveUrl = () => {
    if (!editingPlatform) return
    let newLinks: PlatformLink[]
    if (!urlDraft.trim()) {
      newLinks = links.filter(l => l.platform !== editingPlatform)
    } else {
      const exists = links.find(l => l.platform === editingPlatform)
      newLinks = exists
        ? links.map(l => l.platform === editingPlatform ? { ...l, url: urlDraft.trim() } : l)
        : [...links, { platform: editingPlatform, url: urlDraft.trim() }]
    }
    onUpdate({ ...card, links: newLinks })
    setEditingPlatform(null)
  }

  return (
    <CardShell card={card} isAdmin={isAdmin} onDelete={onDelete}>
      <div className="p-5 flex flex-col gap-3 h-full">
        {card.title && <h3 className="text-white font-semibold text-sm">{card.title}</h3>}

        {/* Сетка иконок */}
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(pl => {
            const url = hasLink(pl.id)
            const active = !!url
            const content = (
              <div
                key={pl.id}
                onClick={() => isAdmin ? togglePlatform(pl.id) : undefined}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all
                  ${active ? "opacity-100 scale-100" : isAdmin ? "opacity-30 hover:opacity-60 cursor-pointer" : "hidden"}
                  ${isAdmin ? "cursor-pointer" : ""}
                `}
                style={active ? { backgroundColor: pl.bg, color: pl.color } : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                title={pl.label}
              >
                <PlatformSvg id={pl.id} size={20} />
                {isAdmin && active && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="Pencil" size={8} />
                  </div>
                )}
              </div>
            )
            return active && !isAdmin ? (
              <a key={pl.id} href={url} target="_blank" rel="noopener noreferrer" title={pl.label}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: pl.bg, color: pl.color }}
                >
                  <PlatformSvg id={pl.id} size={20} />
                </div>
              </a>
            ) : content
          })}
        </div>

        {isAdmin && <p className="text-white/30 text-xs">Нажми на иконку чтобы добавить/изменить ссылку</p>}
      </div>

      {/* Попап ввода ссылки */}
      {editingPlatform && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 p-5 z-20">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PLATFORMS.find(p => p.id === editingPlatform)?.bg, color: PLATFORMS.find(p => p.id === editingPlatform)?.color }}>
              <PlatformSvg id={editingPlatform} size={18} />
            </div>
            {PLATFORMS.find(p => p.id === editingPlatform)?.label}
          </div>
          <input
            autoFocus
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") saveUrl(); if (e.key === "Escape") setEditingPlatform(null) }}
            placeholder="https://..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-white/30"
          />
          <div className="flex gap-2 w-full">
            <button onClick={saveUrl} className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-white text-sm font-medium transition-colors">Сохранить</button>
            <button onClick={() => setEditingPlatform(null)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/60 text-sm transition-colors">Отмена</button>
          </div>
          {urlDraft && (
            <button onClick={() => { setUrlDraft(""); saveUrl() }} className="text-red-400/70 hover:text-red-400 text-xs transition-colors">Удалить ссылку</button>
          )}
        </div>
      )}
    </CardShell>
  )
}

// ─── Текстовая плашка ─────────────────────────────────────────────────────────
function TextCard({ card, isAdmin, onUpdate, onDelete }: { card: Card; isAdmin: boolean; onUpdate: (c: Card) => void; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card)

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(card); setEditing(false) }

  return (
    <CardShell card={card} isAdmin={isAdmin} onDelete={onDelete}>
      <div className="p-5 flex flex-col gap-2 h-full">
        {isAdmin && !editing && (
          <button onClick={() => { setDraft(card); setEditing(true) }} className="absolute top-2.5 right-10 p-1.5 rounded-lg bg-black/40 hover:bg-white/20 text-white/50 hover:text-white transition-all z-10">
            <Icon name="Pencil" size={13} />
          </button>
        )}

        {editing ? (
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex gap-2 items-center">
              <input value={draft.emoji ?? ""} onChange={e => setDraft({ ...draft, emoji: e.target.value })} className="w-12 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center text-lg" placeholder="🚀" />
              <input value={draft.title ?? ""} onChange={e => setDraft({ ...draft, title: e.target.value })} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm outline-none" placeholder="Заголовок" />
            </div>
            <textarea value={draft.description ?? ""} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none outline-none flex-1" placeholder="Описание..." />
            <div className="flex gap-1.5 items-center">
              <span className="text-white/40 text-xs">Размер:</span>
              {(["small", "medium", "large"] as const).map(s => (
                <button key={s} onClick={() => setDraft({ ...draft, size: s })} className={`text-xs px-2 py-0.5 rounded-lg border transition-all ${draft.size === s ? "border-purple-400 bg-purple-400/20 text-purple-300" : "border-white/15 text-white/40 hover:border-white/30"}`}>
                  {sizeMap[s].label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 py-1.5 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">Сохранить</button>
              <button onClick={cancel} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-colors">Отмена</button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-3xl">{card.emoji}</div>
            <h3 className="text-white font-semibold text-sm leading-tight">{card.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{card.description}</p>
          </>
        )}
      </div>
    </CardShell>
  )
}

// ─── Трек-плашка ──────────────────────────────────────────────────────────────
function TrackCard({ card, isAdmin, onUpdate, onDelete }: { card: Card; isAdmin: boolean; onUpdate: (c: Card) => void; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card)

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(card); setEditing(false) }
  const isDirectAudio = (url: string) => url.endsWith(".mp3") || url.endsWith(".ogg") || url.endsWith(".wav") || url.includes("/stream")

  return (
    <CardShell card={card} isAdmin={isAdmin} onDelete={onDelete}>
      <div className="p-5 flex flex-col gap-3 h-full">
        {isAdmin && !editing && (
          <button onClick={() => { setDraft(card); setEditing(true) }} className="absolute top-2.5 right-10 p-1.5 rounded-lg bg-black/40 hover:bg-white/20 text-white/50 hover:text-white transition-all z-10">
            <Icon name="Pencil" size={13} />
          </button>
        )}

        {editing ? (
          <div className="flex flex-col gap-3">
            <input value={draft.trackTitle ?? ""} onChange={e => setDraft({ ...draft, trackTitle: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none" placeholder="Название трека" />
            <input value={draft.trackUrl ?? ""} onChange={e => setDraft({ ...draft, trackUrl: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/70 text-sm outline-none" placeholder="Ссылка (.mp3, SoundCloud, Spotify...)" />
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 py-1.5 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">Сохранить</button>
              <button onClick={cancel} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 rounded-lg text-sm transition-colors">Отмена</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="Music" size={16} className="text-purple-300" />
              </div>
              <span className="text-white font-medium text-sm">{card.trackTitle || "Трек"}</span>
            </div>
            {card.trackUrl ? (
              isDirectAudio(card.trackUrl) ? (
                <audio controls className="w-full rounded-xl">
                  <source src={card.trackUrl} />
                </audio>
              ) : (
                <a href={card.trackUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm transition-colors">
                  <Icon name="ExternalLink" size={14} />Открыть трек
                </a>
              )
            ) : (
              <p className="text-white/30 text-xs">{isAdmin ? "Нажми редактировать и добавь ссылку" : "Скоро будет..."}</p>
            )}
          </>
        )}
      </div>
    </CardShell>
  )
}

// ─── Меню добавления плашки ───────────────────────────────────────────────────
function AddCardMenu({ onAdd }: { onAdd: (type: CardType) => void }) {
  const [open, setOpen] = useState(false)
  const items: { type: CardType; icon: string; label: string }[] = [
    { type: "text",   icon: "FileText",  label: "Текстовая плашка" },
    { type: "social", icon: "Share2",    label: "Соцсети / платформы" },
    { type: "track",  icon: "Music",     label: "Трек" },
    { type: "banner", icon: "Image",     label: "Баннер" },
  ]
  return (
    <div className="col-span-1 relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400/50 bg-transparent hover:bg-purple-500/5 min-h-[120px] flex flex-col items-center justify-center gap-2 text-white/30 hover:text-purple-300 transition-all"
      >
        <Icon name="Plus" size={26} />
        <span className="text-sm">Добавить плашку</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-gray-900/95 border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl z-30">
          {items.map(item => (
            <button
              key={item.type}
              onClick={() => { onAdd(item.type); setOpen(false) }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all text-left"
            >
              <Icon name={item.icon} size={16} className="text-purple-400" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Главная страница ─────────────────────────────────────────────────────────
export default function Index() {
  const [data, setData] = useState<SiteData>(loadData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [adminPwd, setAdminPwd] = useState("")
  const [pwdError, setPwdError] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [initH, setInitH] = useState(0)
  const scrollRef = useRef(0)
  const ticking = useRef(false)
  const ADMIN_PWD = "admin123"

  useEffect(() => { if (initH === 0) setInitH(window.innerHeight) }, [initH])
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setBlurAmount(Math.min(8, (scrollRef.current / (initH * 1.2)) * 8))
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [initH])

  const persist = (next: SiteData) => { setData(next); saveData(next) }

  const updateCard = (updated: Card) =>
    persist({ ...data, cards: data.cards.map(c => c.id === updated.id ? updated : c) })

  const deleteCard = (id: number) =>
    persist({ ...data, cards: data.cards.filter(c => c.id !== id) })

  const addCard = (type: CardType) => {
    const base = { id: Date.now(), size: "medium" as const }
    const extras: Partial<Card> = {
      text:   { title: "Новая плашка", description: "", emoji: "⭐" },
      social: { title: "Платформы", links: [] },
      track:  { trackTitle: "Мой трек", trackUrl: "" },
      banner: { bannerText: "✨ Новый баннер", bannerImage: "" },
    }[type]
    persist({ ...data, cards: [...data.cards, { ...base, type, ...extras }] })
  }

  const login = () => {
    if (adminPwd === ADMIN_PWD) { setIsAdmin(true); setShowLogin(false); setAdminPwd(""); setPwdError(false) }
    else setPwdError(true)
  }

  const renderCard = (card: Card) => {
    const props = { key: card.id, card, isAdmin, onUpdate: updateCard, onDelete: deleteCard }
    if (card.type === "banner") return <BannerCard {...props} />
    if (card.type === "social") return <SocialCard {...props} />
    if (card.type === "track")  return <TrackCard  {...props} />
    return <TextCard {...props} />
  }

  const scaleFactor = 1 + blurAmount / 16
  const heroStyle = { height: initH ? `${initH}px` : "100vh" }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Герой ── */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        <div className="absolute inset-0" style={{ transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }}>
          <StarField blurAmount={blurAmount} />
        </div>

        {/* Кнопка входа */}
        <div className="absolute top-4 right-4 z-20">
          {!isAdmin ? (
            <button onClick={() => setShowLogin(v => !v)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10 transition-all">
              <Icon name="Settings" size={18} />
            </button>
          ) : (
            <button onClick={() => setIsAdmin(false)} className="px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 border border-purple-500/30 text-sm transition-all">
              Просмотр
            </button>
          )}
          {showLogin && !isAdmin && (
            <div className="absolute top-10 right-0 w-56 bg-gray-900/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
              <input type="password" value={adminPwd} onChange={e => { setAdminPwd(e.target.value); setPwdError(false) }} onKeyDown={e => e.key === "Enter" && login()} placeholder="Пароль" className={`bg-white/10 border ${pwdError ? "border-red-400" : "border-white/20"} rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm`} />
              {pwdError && <p className="text-red-400 text-xs">Неверный пароль</p>}
              <button onClick={login} className="py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors">Войти</button>
            </div>
          )}
        </div>

        {/* Название */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center backdrop-blur-sm px-8 py-6 rounded-2xl" style={{ background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)" }}>
            {isAdmin ? (
              <input value={data.platformName} onChange={e => persist({ ...data, platformName: e.target.value })} className="bg-transparent text-white font-bold text-4xl md:text-6xl text-center outline-none border-b-2 border-purple-400/50 pb-1 w-full" placeholder="Название платформы" />
            ) : (
              <h1 className="text-4xl font-bold md:text-6xl">{data.platformName} 🚀</h1>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-white/40" />
        </div>
      </section>

      {/* ── Плашки ── */}
      <section className="bg-gradient-to-b from-black via-gray-950 to-black min-h-screen">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.cards.map(renderCard)}
            {isAdmin && <AddCardMenu onAdd={addCard} />}
          </div>
        </div>
      </section>

      {/* ── Футер ── */}
      <footer className="bg-black border-t border-white/5 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          {isAdmin ? (
            <input value={data.platformName} onChange={e => persist({ ...data, platformName: e.target.value })} className="bg-transparent text-white font-bold text-lg text-center outline-none border-b border-white/20 pb-0.5 w-48" placeholder="Название" />
          ) : (
            <span className="text-white font-bold text-lg">{data.platformName}</span>
          )}
          {isAdmin ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={data.nickname} onChange={e => persist({ ...data, nickname: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/70 text-sm outline-none w-36 text-center" placeholder="@ник" />
              <input value={data.profileUrl} onChange={e => persist({ ...data, profileUrl: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/50 text-sm outline-none w-56" placeholder="https://ссылка..." />
            </div>
          ) : data.nickname ? (
            <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-purple-300 text-sm flex items-center gap-1.5 transition-colors">
              <Icon name="Link" size={13} />{data.nickname}
            </a>
          ) : null}
          <p className="text-white/20 text-xs">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
