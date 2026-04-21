import { useState, useEffect, useRef } from "react"
import { StarField } from "@/components/StarField"
import Icon from "@/components/ui/icon"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { Card, SiteData, DEFAULT_STYLE, loadData, saveData } from "@/components/cards/types"
import { UnifiedCard } from "@/components/cards/UnifiedCard"

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const persist = (next: SiteData) => { setData(next); saveData(next) }
  const updateCard = (updated: Card) => persist({ ...data, cards: data.cards.map(c => c.id === updated.id ? updated : c) })
  const deleteCard = (id: number) => persist({ ...data, cards: data.cards.filter(c => c.id !== id) })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = data.cards.findIndex(c => c.id === active.id)
      const newIndex = data.cards.findIndex(c => c.id === over.id)
      persist({ ...data, cards: arrayMove(data.cards, oldIndex, newIndex) })
    }
  }

  const addCard = () => persist({
    ...data,
    cards: [...data.cards, {
      id: Date.now(), size: "medium", style: { ...DEFAULT_STYLE },
      blocks: [{ id: `b${Date.now()}`, type: "text", title: "Новая плашка", description: "", emoji: "⭐" }],
    }],
  })

  const login = () => {
    if (adminPwd === ADMIN_PWD) { setIsAdmin(true); setShowLogin(false); setAdminPwd(""); setPwdError(false) }
    else setPwdError(true)
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

        {/* Вход */}
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
              <input
                type="password"
                value={adminPwd}
                onChange={e => { setAdminPwd(e.target.value); setPwdError(false) }}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="Пароль"
                className={`bg-white/10 border ${pwdError ? "border-red-400" : "border-white/20"} rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm`}
              />
              {pwdError && <p className="text-red-400 text-xs">Неверный пароль</p>}
              <button onClick={login} className="py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors">Войти</button>
            </div>
          )}
        </div>

        {/* Название */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
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
              <h1 className="text-4xl font-bold md:text-6xl">{data.platformName}</h1>
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.cards.map(c => c.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {data.cards.map(card => (
                  <UnifiedCard key={card.id} card={card} isAdmin={isAdmin} onUpdate={updateCard} onDelete={deleteCard} />
                ))}
                {isAdmin && (
                  <button
                    onClick={addCard}
                    className="col-span-1 rounded-2xl border-2 border-dashed border-white/15 hover:border-purple-400/40 min-h-[120px] flex flex-col items-center justify-center gap-2 text-white/25 hover:text-purple-300 transition-all"
                  >
                    <Icon name="Plus" size={24} />
                    <span className="text-sm">Новая плашка</span>
                  </button>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>

      {/* ── Футер ── */}
      <footer className="bg-black border-t border-white/5 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          {isAdmin ? (
            <input
              value={data.platformName}
              onChange={e => persist({ ...data, platformName: e.target.value })}
              className="bg-transparent text-white font-bold text-lg text-center outline-none border-b border-white/20 pb-0.5 w-48"
              placeholder="Название"
            />
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
