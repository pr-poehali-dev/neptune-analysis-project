import { StarField } from "@/components/StarField"
import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

// ─── типы ────────────────────────────────────────────────────────────────────
interface Card {
  id: number
  title: string
  description: string
  size: "small" | "medium" | "large"
  emoji: string
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
  nickname: "@nebula",
  profileUrl: "https://t.me/nebula",
  trackUrl: "",
  trackTitle: "Мой трек",
  cards: [
    { id: 1, title: "Обо мне", description: "Расскажите о себе здесь — кто вы, чем занимаетесь и что предлагаете.", size: "large", emoji: "🚀" },
    { id: 2, title: "Услуги", description: "Перечислите ваши услуги и преимущества работы с вами.", size: "medium", emoji: "💡" },
    { id: 3, title: "Контакты", description: "Как с вами связаться — почта, телефон, соцсети.", size: "small", emoji: "📩" },
  ],
}

// ─── утилита: локальное хранилище ─────────────────────────────────────────────
function loadData(): SiteData {
  try {
    const raw = localStorage.getItem("nebula_data")
    return raw ? JSON.parse(raw) : DEFAULT_DATA
  } catch {
    return DEFAULT_DATA
  }
}

function saveData(data: SiteData) {
  localStorage.setItem("nebula_data", JSON.stringify(data))
}

// ─── иконка пера (встроенная) ─────────────────────────────────────────────────
const sizeMap = {
  small: { label: "Маленькая", cols: "col-span-1", minH: "min-h-[120px]" },
  medium: { label: "Средняя", cols: "col-span-1 sm:col-span-2", minH: "min-h-[160px]" },
  large: { label: "Большая", cols: "col-span-1 sm:col-span-3", minH: "min-h-[200px]" },
}

// ─── Компонент редактируемой плашки ──────────────────────────────────────────
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

  const save = () => {
    onUpdate(draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(card)
    setEditing(false)
  }

  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2 transition-all hover:border-white/20 hover:bg-white/8 ${sizeMap[card.size].cols} ${sizeMap[card.size].minH}`}
    >
      {isAdmin && !editing && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => { setDraft(card); setEditing(true) }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            title="Редактировать"
          >
            <Icon name="Pencil" size={14} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/40 text-white/70 hover:text-red-300 transition-all"
            title="Удалить"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      )}

      {editing ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input
              value={draft.emoji}
              onChange={e => setDraft({ ...draft, emoji: e.target.value })}
              className="w-14 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center text-xl"
              placeholder="🚀"
            />
            <input
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder-white/40 text-sm"
              placeholder="Заголовок"
            />
          </div>
          <textarea
            value={draft.description}
            onChange={e => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm resize-none"
            placeholder="Описание..."
          />
          <div className="flex gap-2 items-center">
            <span className="text-white/50 text-xs">Размер:</span>
            {(["small", "medium", "large"] as const).map(s => (
              <button
                key={s}
                onClick={() => setDraft({ ...draft, size: s })}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  draft.size === s
                    ? "border-purple-400 bg-purple-400/20 text-purple-300"
                    : "border-white/20 bg-white/5 text-white/50 hover:border-white/40"
                }`}
              >
                {sizeMap[s].label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-1.5 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
              Сохранить
            </button>
            <button onClick={cancel} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors">
              Отмена
            </button>
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
  const [editingField, setEditingField] = useState<string | null>(null)
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

  const persist = (next: SiteData) => {
    setData(next)
    saveData(next)
  }

  const updateCard = (updated: Card) =>
    persist({ ...data, cards: data.cards.map(c => (c.id === updated.id ? updated : c)) })

  const deleteCard = (id: number) =>
    persist({ ...data, cards: data.cards.filter(c => c.id !== id) })

  const addCard = () => {
    const newCard: Card = {
      id: Date.now(),
      title: "Новая плашка",
      description: "Добавьте описание здесь.",
      size: "small",
      emoji: "⭐",
    }
    persist({ ...data, cards: [...data.cards, newCard] })
  }

  const login = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowAdminLogin(false)
      setAdminPassword("")
      setPasswordError(false)
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
            <button
              onClick={() => setShowAdminLogin(v => !v)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10 transition-all"
              title="Войти как администратор"
            >
              <Icon name="Settings" size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsAdmin(false)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 border border-purple-500/30 text-sm transition-all"
            >
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
              <button onClick={login} className="py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors">
                Войти
              </button>
            </div>
          )}
        </div>

        {/* Центральный контент */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div
            className="text-center backdrop-blur-sm px-8 py-6 rounded-2xl"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)" }}
          >
            <h1 className="text-4xl font-bold md:text-6xl font-heading">
              {data.platformName} 🚀
            </h1>
            <p className="mt-3 text-lg text-white/70 md:text-xl">
              {data.nickname}
            </p>
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
            {isAdmin && (
              <span className="absolute top-1 right-2 text-purple-400/50 text-xs">✏️ баннер</span>
            )}
          </div>

          {/* Плашки */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                isAdmin={isAdmin}
                onUpdate={updateCard}
                onDelete={deleteCard}
              />
            ))}

            {/* Кнопка добавить плашку */}
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
                <input
                  value={data.trackTitle}
                  onChange={e => persist({ ...data, trackTitle: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm mb-2 outline-none"
                  placeholder="Название трека"
                />
                <input
                  value={data.trackUrl}
                  onChange={e => persist({ ...data, trackUrl: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/70 text-sm outline-none"
                  placeholder="Ссылка на трек (SoundCloud, Spotify, прямой .mp3...)"
                />
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
                  <a
                    href={data.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm transition-colors"
                  >
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
          {/* Название платформы */}
          {isAdmin ? (
            <input
              value={data.platformName}
              onChange={e => persist({ ...data, platformName: e.target.value })}
              className="bg-transparent text-white font-bold text-lg text-center outline-none border-b border-white/20 pb-0.5 w-48"
              placeholder="Название платформы"
            />
          ) : (
            <span className="text-white font-bold text-lg">{data.platformName}</span>
          )}

          {/* Ник + ссылка */}
          {isAdmin ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                value={data.nickname}
                onChange={e => persist({ ...data, nickname: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/70 text-sm outline-none w-36 text-center"
                placeholder="@ник"
              />
              <input
                value={data.profileUrl}
                onChange={e => persist({ ...data, profileUrl: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/50 text-sm outline-none w-56"
                placeholder="https://ссылка..."
              />
            </div>
          ) : (
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-purple-300 text-sm transition-colors flex items-center gap-1.5"
            >
              <Icon name="Link" size={13} />
              {data.nickname}
            </a>
          )}

          <p className="text-white/20 text-xs mt-1">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
