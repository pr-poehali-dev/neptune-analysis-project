import { StarField } from "@/components/StarField"
import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

// ─── типы ────────────────────────────────────────────────────────────────────
type PlatformLink = {
  platform: "steam" | "telegram" | "vk" | "none"
  url: string
  label: string
}

interface Card {
  id: number
  title: string
  description: string
  size: "small" | "medium" | "large"
  emoji: string
  type: "text" | "social"
  links?: PlatformLink[]
}

interface SiteData {
  banner: string
  platformName: string
  nickname: string
  profileUrl: string
  trackUrl: string
  trackTitle: string
  cards: Card[]
}

// ─── начальные данные ─────────────────────────────────────────────────────────
const DEFAULT_DATA: SiteData = {
  banner: "✨ Добро пожаловать на мою платформу!",
  platformName: "Nebula Ventures",
  nickname: "",
  profileUrl: "https://t.me/nebula",
  trackUrl: "",
  trackTitle: "Мой трек",
  cards: [
    {
      id: 1,
      title: "Мои платформы",
      description: "",
      size: "large",
      emoji: "🎮",
      type: "social",
      links: [
        { platform: "steam", url: "", label: "Steam" },
        { platform: "telegram", url: "", label: "Telegram" },
        { platform: "vk", url: "", label: "ВКонтакте" },
      ],
    },
    { id: 2, title: "Услуги", description: "Перечислите ваши услуги и преимущества работы с вами.", size: "medium", emoji: "💡", type: "text" },
    { id: 3, title: "Контакты", description: "Как с вами связаться — почта, телефон, соцсети.", size: "small", emoji: "📩", type: "text" },
  ],
}

// ─── локальное хранилище ─────────────────────────────────────────────────────
function loadData(): SiteData {
  try {
    const raw = localStorage.getItem("nebula_data")
    if (!raw) return DEFAULT_DATA
    const parsed = JSON.parse(raw)
    // миграция старых данных без поля type
    if (parsed.cards) {
      parsed.cards = parsed.cards.map((c: Card) => ({ type: "text", ...c }))
    }
    return parsed
  } catch {
    return DEFAULT_DATA
  }
}

function saveData(data: SiteData) {
  localStorage.setItem("nebula_data", JSON.stringify(data))
}

const sizeMap = {
  small: { label: "Маленькая", cols: "col-span-1", minH: "min-h-[120px]" },
  medium: { label: "Средняя", cols: "col-span-1 sm:col-span-2", minH: "min-h-[160px]" },
  large: { label: "Большая", cols: "col-span-1 sm:col-span-3", minH: "min-h-[200px]" },
}

// ─── SVG иконки соцсетей ──────────────────────────────────────────────────────
function SteamIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
    </svg>
  )
}

function TelegramIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function VkIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.169-.407.44-.407h2.743c.372 0 .508.203.508.643v3.473c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.607 2.168-3.607.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  )
}

function PlatformIcon({ platform, size = 32 }: { platform: PlatformLink["platform"]; size?: number }) {
  if (platform === "steam") return <SteamIcon size={size} />
  if (platform === "telegram") return <TelegramIcon size={size} />
  if (platform === "vk") return <VkIcon size={size} />
  return null
}

const platformColors: Record<string, string> = {
  steam: "hover:bg-[#1b2838]/60 hover:border-[#66c0f4]/40 text-[#66c0f4]",
  telegram: "hover:bg-[#0088cc]/20 hover:border-[#0088cc]/40 text-[#0088cc]",
  vk: "hover:bg-[#0077ff]/20 hover:border-[#0077ff]/40 text-[#0077ff]",
}

// ─── Плашка с соцсетями ───────────────────────────────────────────────────────
function SocialCard({
  card,
  isAdmin,
  onUpdate,
  onDelete,
}: {
  card: Card
  isAdmin: boolean
  onUpdate: (card: Card) => void
  onDelete: (id: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card)

  const links: PlatformLink[] = card.links ?? []
  const draftLinks: PlatformLink[] = draft.links ?? []

  const updateLink = (platform: PlatformLink["platform"], url: string) => {
    setDraft({
      ...draft,
      links: draftLinks.map(l => l.platform === platform ? { ...l, url } : l),
    })
  }

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(card); setEditing(false) }

  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3 transition-all hover:border-white/20 ${sizeMap[card.size].cols} ${sizeMap[card.size].minH}`}>
      {isAdmin && !editing && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button onClick={() => { setDraft(card); setEditing(true) }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all" title="Редактировать">
            <Icon name="Pencil" size={14} />
          </button>
          <button onClick={() => onDelete(card.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/40 text-white/70 hover:text-red-300 transition-all" title="Удалить">
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      )}

      <h3 className="text-white font-semibold text-base">{card.title}</h3>

      {editing ? (
        <div className="flex flex-col gap-3">
          {draftLinks.map(link => (
            <div key={link.platform} className="flex items-center gap-3">
              <div className={`w-8 h-8 flex items-center justify-center opacity-80 ${platformColors[link.platform]?.split(" ")[2] ?? "text-white/60"}`}>
                <PlatformIcon platform={link.platform} size={22} />
              </div>
              <input
                value={link.url}
                onChange={e => updateLink(link.platform, e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/80 text-sm outline-none"
                placeholder={`Ссылка на ${link.label}...`}
              />
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <button onClick={save} className="flex-1 py-1.5 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">Сохранить</button>
            <button onClick={cancel} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors">Отмена</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 flex-wrap">
          {links.map(link =>
            link.url ? (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 transition-all ${platformColors[link.platform] ?? ""}`}
              >
                <PlatformIcon platform={link.platform} size={22} />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ) : isAdmin ? (
              <div key={link.platform} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 bg-white/3 text-white/20">
                <PlatformIcon platform={link.platform} size={22} />
                <span className="text-sm">{link.label}</span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

// ─── Обычная плашка ───────────────────────────────────────────────────────────
function CardItem({
  card,
  isAdmin,
  onUpdate,
  onDelete,
}: {
  card: Card
  isAdmin: boolean
  onUpdate: (card: Card) => void
  onDelete: (id: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card)

  const save = () => { onUpdate(draft); setEditing(false) }
  const cancel = () => { setDraft(card); setEditing(false) }

  if (card.type === "social") {
    return <SocialCard card={card} isAdmin={isAdmin} onUpdate={onUpdate} onDelete={onDelete} />
  }

  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2 transition-all hover:border-white/20 ${sizeMap[card.size].cols} ${sizeMap[card.size].minH}`}>
      {isAdmin && !editing && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button onClick={() => { setDraft(card); setEditing(true) }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all" title="Редактировать">
            <Icon name="Pencil" size={14} />
          </button>
          <button onClick={() => onDelete(card.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/40 text-white/70 hover:text-red-300 transition-all" title="Удалить">
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      )}

      {editing ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input value={draft.emoji} onChange={e => setDraft({ ...draft, emoji: e.target.value })} className="w-14 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center text-xl" placeholder="🚀" />
            <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder-white/40 text-sm" placeholder="Заголовок" />
          </div>
          <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm resize-none" placeholder="Описание..." />
          <div className="flex gap-2 items-center">
            <span className="text-white/50 text-xs">Размер:</span>
            {(["small", "medium", "large"] as const).map(s => (
              <button key={s} onClick={() => setDraft({ ...draft, size: s })} className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${draft.size === s ? "border-purple-400 bg-purple-400/20 text-purple-300" : "border-white/20 bg-white/5 text-white/50 hover:border-white/40"}`}>
                {sizeMap[s].label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-1.5 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">Сохранить</button>
            <button onClick={cancel} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors">Отмена</button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-3xl">{card.emoji}</div>
          <h3 className="text-white font-semibold text-base leading-tight">{card.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{card.description}</p>
        </>
      )}
    </div>
  )
}

// ─── Главная страница ─────────────────────────────────────────────────────────
export default function Index() {
  const [data, setData] = useState<SiteData>(loadData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)
  const scrollRef = useRef(0)
  const ticking = useRef(false)
  const ADMIN_PASSWORD = "admin123"

  useEffect(() => {
    if (initialHeight === 0) setInitialHeight(window.innerHeight)
  }, [initialHeight])

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const maxBlur = 8
          const triggerHeight = initialHeight * 1.2
          setBlurAmount(Math.min(maxBlur, (scrollRef.current / triggerHeight) * maxBlur))
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [initialHeight])

  const persist = (next: SiteData) => { setData(next); saveData(next) }

  const updateCard = (updated: Card) =>
    persist({ ...data, cards: data.cards.map(c => c.id === updated.id ? updated : c) })

  const deleteCard = (id: number) =>
    persist({ ...data, cards: data.cards.filter(c => c.id !== id) })

  const addCard = () => {
    persist({
      ...data,
      cards: [...data.cards, { id: Date.now(), title: "Новая плашка", description: "Добавьте описание здесь.", size: "small", emoji: "⭐", type: "text" }],
    })
  }

  const login = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowAdminLogin(false); setAdminPassword(""); setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const scaleFactor = 1 + blurAmount / 16
  const heroStyle = { height: initialHeight ? `${initialHeight}px` : "100vh" }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Герой со звёздами ── */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        <div className="absolute inset-0" style={{ transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }}>
          <StarField blurAmount={blurAmount} />
        </div>

        {/* Кнопка входа для админа */}
        <div className="absolute top-4 right-4 z-20">
          {!isAdmin ? (
            <button onClick={() => setShowAdminLogin(v => !v)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10 transition-all" title="Войти как администратор">
              <Icon name="Settings" size={18} />
            </button>
          ) : (
            <button onClick={() => setIsAdmin(false)} className="px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 border border-purple-500/30 text-sm transition-all">
              Режим просмотра
            </button>
          )}

          {showAdminLogin && !isAdmin && (
            <div className="absolute top-10 right-0 w-56 bg-gray-900/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
              <input
                type="password"
                value={adminPassword}
                onChange={e => { setAdminPassword(e.target.value); setPasswordError(false) }}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="Пароль"
                className={`bg-white/10 border ${passwordError ? "border-red-400" : "border-white/20"} rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm`}
              />
              {passwordError && <p className="text-red-400 text-xs">Неверный пароль</p>}
              <button onClick={login} className="py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors">Войти</button>
            </div>
          )}
        </div>

        {/* Центральный контент */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div
            className="text-center backdrop-blur-sm px-8 py-6 rounded-2xl"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)" }}
          >
            {isAdmin ? (
              <input
                value={data.platformName}
                onChange={e => persist({ ...data, platformName: e.target.value })}
                className="bg-transparent text-white font-bold text-4xl md:text-6xl text-center outline-none border-b-2 border-purple-400/50 pb-1 w-full"
                placeholder="Название платформы"
              />
            ) : (
              <h1 className="text-4xl font-bold md:text-6xl font-heading">
                {data.platformName} 🚀
              </h1>
            )}
          </div>
        </div>

        {/* Стрелка вниз */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-white/40" />
        </div>
      </section>

      {/* ── Основной контент ── */}
      <section className="relative bg-gradient-to-b from-black via-gray-950 to-black min-h-screen pb-12">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-32">

          {/* Баннер */}
          <div className="relative mb-8 rounded-2xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm px-5 py-3.5">
            {isAdmin ? (
              <input
                value={data.banner}
                onChange={e => persist({ ...data, banner: e.target.value })}
                className="w-full bg-transparent text-purple-200 text-sm font-medium text-center outline-none placeholder-purple-300/50"
                placeholder="Текст баннера..."
              />
            ) : (
              <p className="text-purple-200 text-sm font-medium text-center">{data.banner}</p>
            )}
            {isAdmin && <span className="absolute top-1 right-2 text-purple-400/50 text-xs">✏️ баннер</span>}
          </div>

          {/* Плашки */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.cards.map(card => (
              <CardItem key={card.id} card={card} isAdmin={isAdmin} onUpdate={updateCard} onDelete={deleteCard} />
            ))}
            {isAdmin && (
              <button
                onClick={addCard}
                className="col-span-1 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400/50 bg-transparent hover:bg-purple-500/5 min-h-[120px] flex flex-col items-center justify-center gap-2 text-white/30 hover:text-purple-300 transition-all"
              >
                <Icon name="Plus" size={28} />
                <span className="text-sm">Добавить плашку</span>
              </button>
            )}
          </div>

          {/* Трек */}
          <div className="mt-10">
            {isAdmin ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">Трек</p>
                <input value={data.trackTitle} onChange={e => persist({ ...data, trackTitle: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm mb-2 outline-none" placeholder="Название трека" />
                <input value={data.trackUrl} onChange={e => persist({ ...data, trackUrl: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/70 text-sm outline-none" placeholder="Ссылка на трек (SoundCloud, Spotify, прямой .mp3...)" />
              </div>
            ) : data.trackUrl ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <Icon name="Music" size={16} className="text-purple-300" />
                  </div>
                  <span className="text-white font-medium text-sm">{data.trackTitle}</span>
                </div>
                {data.trackUrl.endsWith(".mp3") || data.trackUrl.includes("stream") ? (
                  <audio controls className="w-full" style={{ borderRadius: "12px" }}>
                    <source src={data.trackUrl} />
                  </audio>
                ) : (
                  <a href={data.trackUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm transition-colors">
                    <Icon name="ExternalLink" size={14} />
                    Открыть трек
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Футер ── */}
      <footer className="bg-black border-t border-white/5 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          {isAdmin ? (
            <input value={data.platformName} onChange={e => persist({ ...data, platformName: e.target.value })} className="bg-transparent text-white font-bold text-lg text-center outline-none border-b border-white/20 pb-0.5 w-48" placeholder="Название платформы" />
          ) : (
            <span className="text-white font-bold text-lg">{data.platformName}</span>
          )}

          {isAdmin ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input value={data.nickname} onChange={e => persist({ ...data, nickname: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/70 text-sm outline-none w-36 text-center" placeholder="@ник" />
              <input value={data.profileUrl} onChange={e => persist({ ...data, profileUrl: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/50 text-sm outline-none w-56" placeholder="https://ссылка..." />
            </div>
          ) : data.nickname ? (
            <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-purple-300 text-sm transition-colors flex items-center gap-1.5">
              <Icon name="Link" size={13} />
              {data.nickname}
            </a>
          ) : null}

          <p className="text-white/20 text-xs mt-1">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
