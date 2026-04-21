import { useState, useRef } from "react"
import Icon from "@/components/ui/icon"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CardBlock, CardStyle, Platform, PLATFORMS } from "./types"

// ─── SVG иконки соцсетей ──────────────────────────────────────────────────────
export function PlatformSvg({ id, size = 22 }: { id: Platform; size?: number }) {
  const s = size
  if (id === "steam")     return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>
  if (id === "telegram")  return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  if (id === "vk")        return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.169-.407.44-.407h2.743c.372 0 .508.203.508.643v3.473c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.607 2.168-3.607.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/></svg>
  if (id === "youtube")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  if (id === "discord")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.11 18.1.127 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
  if (id === "tiktok")    return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  if (id === "twitter")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
  if (id === "instagram") return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  if (id === "twitch")    return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
  return null
}

// ─── Рендер блока ─────────────────────────────────────────────────────────────
export function BlockView({
  block, cardStyle, isAdmin, onUpdateBlock, onRemoveBlock,
}: {
  block: CardBlock
  cardStyle: CardStyle
  isAdmin: boolean
  onUpdateBlock: (b: CardBlock) => void
  onRemoveBlock: (id: string) => void
}) {
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null)
  const [urlDraft, setUrlDraft] = useState("")
  const [editingBlock, setEditingBlock] = useState(false)
  const [draft, setDraft] = useState(block)
  const fileRef = useRef<HTMLInputElement>(null)

  const links = block.links ?? []
  const getUrl = (p: Platform) => links.find(l => l.platform === p)?.url ?? ""

  const savePlatform = () => {
    if (!editingPlatform) return
    const newLinks = !urlDraft.trim()
      ? links.filter(l => l.platform !== editingPlatform)
      : links.find(l => l.platform === editingPlatform)
        ? links.map(l => l.platform === editingPlatform ? { ...l, url: urlDraft } : l)
        : [...links, { platform: editingPlatform, url: urlDraft }]
    onUpdateBlock({ ...block, links: newLinks })
    setEditingPlatform(null)
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onUpdateBlock({ ...block, bannerImage: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  const saveDraft = () => { onUpdateBlock(draft); setEditingBlock(false) }

  const isDirectAudio = (url: string) =>
    url.endsWith(".mp3") || url.endsWith(".ogg") || url.endsWith(".wav") || url.includes("/stream")

  return (
    <div className="relative">
      {isAdmin && (
        <button
          onClick={() => onRemoveBlock(block.id)}
          className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-black/70 hover:bg-red-500/80 text-white/40 hover:text-white flex items-center justify-center transition-all"
        >
          <Icon name="X" size={10} />
        </button>
      )}

      {/* BANNER */}
      {block.type === "banner" && (
        <div
          className="rounded-xl overflow-hidden"
          style={block.bannerImage
            ? { backgroundImage: `url(${block.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: `linear-gradient(135deg, ${cardStyle.linkColor}22, ${cardStyle.bg})` }}
        >
          <div className={`flex flex-col items-center justify-center gap-2 p-4 ${block.bannerImage ? "bg-black/40" : ""}`}>
            {isAdmin ? (
              <input
                value={block.bannerText ?? ""}
                onChange={e => onUpdateBlock({ ...block, bannerText: e.target.value })}
                className="bg-transparent text-sm font-medium text-center outline-none border-b pb-0.5 w-full"
                style={{ color: cardStyle.textColor, borderColor: cardStyle.linkColor + "60" }}
                placeholder="Текст баннера..."
              />
            ) : (
              <p className="text-sm font-medium text-center" style={{ color: cardStyle.textColor }}>{block.bannerText}</p>
            )}
            {isAdmin && (
              <div className="flex gap-2 mt-1">
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-xs transition-all">
                  <Icon name="ImagePlus" size={12} />{block.bannerImage ? "Заменить" : "Добавить фото"}
                </button>
                {block.bannerImage && (
                  <button onClick={() => onUpdateBlock({ ...block, bannerImage: "" })} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/40 hover:text-red-300 text-xs transition-all">Убрать</button>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        </div>
      )}

      {/* TEXT */}
      {block.type === "text" && (
        <div>
          {isAdmin && !editingBlock && (
            <button onClick={() => { setDraft(block); setEditingBlock(true) }} className="absolute top-0 right-5 p-1 rounded-lg bg-black/40 hover:bg-white/10 text-white/30 hover:text-white/70 transition-all z-10">
              <Icon name="Pencil" size={12} />
            </button>
          )}
          {editingBlock ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input value={draft.emoji ?? ""} onChange={e => setDraft({ ...draft, emoji: e.target.value })} className="w-10 bg-white/10 border border-white/20 rounded-lg px-1 py-1 text-white text-center text-base" placeholder="🚀" />
                <input value={draft.title ?? ""} onChange={e => setDraft({ ...draft, title: e.target.value })} className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm outline-none" placeholder="Заголовок" />
              </div>
              <textarea value={draft.description ?? ""} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={2} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none outline-none" placeholder="Описание..." />
              <div className="flex gap-2">
                <button onClick={saveDraft} className="flex-1 py-1 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors">Сохранить</button>
                <button onClick={() => setEditingBlock(false)} className="flex-1 py-1 bg-white/10 text-white/50 rounded-lg text-xs transition-colors">Отмена</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-1">{block.emoji}</div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: cardStyle.textColor }}>{block.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: cardStyle.textColor + "99" }}>{block.description}</p>
            </div>
          )}
        </div>
      )}

      {/* SOCIAL */}
      {block.type === "social" && (
        <div className="relative">
          {block.title && <h3 className="font-semibold text-xs mb-2 uppercase tracking-wider" style={{ color: cardStyle.textColor + "80" }}>{block.title}</h3>}
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(pl => {
              const url = getUrl(pl.id)
              const active = !!url
              if (!active && !isAdmin) return null
              const inner = (
                <div
                  key={pl.id}
                  onClick={() => { if (isAdmin) { setEditingPlatform(pl.id); setUrlDraft(url) } }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isAdmin ? "cursor-pointer" : ""} ${active ? "opacity-100" : "opacity-25 hover:opacity-50"}`}
                  style={active ? { backgroundColor: pl.bg, color: pl.color } : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  title={pl.label}
                >
                  <PlatformSvg id={pl.id} size={18} />
                </div>
              )
              return active && !isAdmin ? (
                <a key={pl.id} href={url} target="_blank" rel="noopener noreferrer">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: pl.bg, color: pl.color }}>
                    <PlatformSvg id={pl.id} size={18} />
                  </div>
                </a>
              ) : inner
            })}
          </div>
          {isAdmin && <p className="text-white/25 text-xs mt-2">Нажми иконку → добавь ссылку</p>}

          {editingPlatform && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2.5 p-4 z-20">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: PLATFORMS.find(p => p.id === editingPlatform)?.bg, color: PLATFORMS.find(p => p.id === editingPlatform)?.color }}>
                  <PlatformSvg id={editingPlatform} size={16} />
                </div>
                {PLATFORMS.find(p => p.id === editingPlatform)?.label}
              </div>
              <input autoFocus value={urlDraft} onChange={e => setUrlDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") savePlatform(); if (e.key === "Escape") setEditingPlatform(null) }} placeholder="https://..." className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm outline-none" />
              <div className="flex gap-2 w-full">
                <button onClick={savePlatform} className="flex-1 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-xl text-white text-sm font-medium transition-colors">Сохранить</button>
                <button onClick={() => setEditingPlatform(null)} className="flex-1 py-1.5 bg-white/10 rounded-xl text-white/50 text-sm transition-colors">Отмена</button>
              </div>
              {urlDraft && <button onClick={() => { setUrlDraft(""); savePlatform() }} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">Удалить ссылку</button>}
            </div>
          )}
        </div>
      )}

      {/* TRACK */}
      {block.type === "track" && (
        <div>
          {isAdmin && !editingBlock && (
            <button onClick={() => { setDraft(block); setEditingBlock(true) }} className="absolute top-0 right-5 p-1 rounded-lg bg-black/40 hover:bg-white/10 text-white/30 hover:text-white/70 transition-all z-10">
              <Icon name="Pencil" size={12} />
            </button>
          )}
          {editingBlock ? (
            <div className="flex flex-col gap-2">
              <input value={draft.trackTitle ?? ""} onChange={e => setDraft({ ...draft, trackTitle: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm outline-none" placeholder="Название трека" />
              <input value={draft.trackUrl ?? ""} onChange={e => setDraft({ ...draft, trackUrl: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/60 text-sm outline-none" placeholder="Ссылка (.mp3, SoundCloud...)" />
              <div className="flex gap-2">
                <button onClick={saveDraft} className="flex-1 py-1 bg-purple-500/80 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors">Сохранить</button>
                <button onClick={() => setEditingBlock(false)} className="flex-1 py-1 bg-white/10 text-white/50 rounded-lg text-xs transition-colors">Отмена</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: cardStyle.linkColor + "33" }}>
                  <Icon name="Music" size={15} style={{ color: cardStyle.linkColor }} />
                </div>
                <span className="font-medium text-sm" style={{ color: cardStyle.textColor }}>{block.trackTitle || "Трек"}</span>
              </div>
              {block.trackUrl ? (
                isDirectAudio(block.trackUrl) ? (
                  <audio controls className="w-full rounded-xl"><source src={block.trackUrl} /></audio>
                ) : (
                  <a href={block.trackUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: cardStyle.linkColor }}>
                    <Icon name="ExternalLink" size={13} />Открыть трек
                  </a>
                )
              ) : (
                <p className="text-xs" style={{ color: cardStyle.textColor + "40" }}>{isAdmin ? "Нажми карандаш и добавь ссылку" : "Скоро будет..."}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sortable-обёртка для блока ───────────────────────────────────────────────
export function SortableBlock({
  block, cardStyle, isAdmin, onUpdateBlock, onRemoveBlock,
}: {
  block: CardBlock
  cardStyle: CardStyle
  isAdmin: boolean
  onUpdateBlock: (b: CardBlock) => void
  onRemoveBlock: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id, disabled: !isAdmin })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition: transition ?? undefined }}
      className={`relative group/block ${isDragging ? "opacity-40 z-50" : ""}`}
    >
      {isAdmin && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 p-0.5 rounded opacity-0 group-hover/block:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70"
          title="Переместить блок"
        >
          <Icon name="GripVertical" size={14} />
        </button>
      )}
      <div className={isAdmin ? "pl-4" : ""}>
        <BlockView
          block={block}
          cardStyle={cardStyle}
          isAdmin={isAdmin}
          onUpdateBlock={onUpdateBlock}
          onRemoveBlock={onRemoveBlock}
        />
      </div>
    </div>
  )
}
