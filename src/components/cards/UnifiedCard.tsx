import { useState } from "react"
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
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardBlock, CardStyle, BlockType, DEFAULT_STYLE, sizeMap } from "./types"
import { SortableBlock } from "./BlockView"

// ─── Настройка стиля плашки ───────────────────────────────────────────────────
function StyleEditor({ style, onChange }: { style: CardStyle; onChange: (s: CardStyle) => void }) {
  const fields: { key: keyof CardStyle; label: string }[] = [
    { key: "bg",          label: "Фон" },
    { key: "border",      label: "Обводка" },
    { key: "hoverBorder", label: "Hover обводка" },
    { key: "textColor",   label: "Текст" },
    { key: "linkColor",   label: "Ссылки / акцент" },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 p-3 bg-black/50 rounded-xl border border-white/10">
      <p className="col-span-2 text-white/40 text-xs uppercase tracking-wider mb-1">Цвета плашки</p>
      {fields.map(f => (
        <label key={f.key} className="flex items-center gap-2 cursor-pointer">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
            <input type="color" value={style[f.key]} onChange={e => onChange({ ...style, [f.key]: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full h-full rounded-lg" style={{ backgroundColor: style[f.key] }} />
          </div>
          <span className="text-white/50 text-xs">{f.label}</span>
        </label>
      ))}
      <button onClick={() => onChange({ ...DEFAULT_STYLE })} className="col-span-2 mt-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 text-xs transition-colors">
        Сбросить цвета
      </button>
    </div>
  )
}

// ─── Единая плашка ────────────────────────────────────────────────────────────
export function UnifiedCard({
  card, isAdmin, onUpdate, onDelete,
}: {
  card: Card
  isAdmin: boolean
  onUpdate: (c: Card) => void
  onDelete: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id, disabled: !isAdmin })

  const [showSettings, setShowSettings] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)

  const blockSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const updateBlock = (updated: CardBlock) =>
    onUpdate({ ...card, blocks: card.blocks.map(b => b.id === updated.id ? updated : b) })

  const removeBlock = (bid: string) =>
    onUpdate({ ...card, blocks: card.blocks.filter(b => b.id !== bid) })

  const handleBlockDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIdx = card.blocks.findIndex(b => b.id === active.id)
      const newIdx = card.blocks.findIndex(b => b.id === over.id)
      onUpdate({ ...card, blocks: arrayMove(card.blocks, oldIdx, newIdx) })
    }
  }

  const addBlock = (type: BlockType) => {
    const id = `b${Date.now()}`
    const extras: Partial<CardBlock> = {
      text:   { title: "Новый блок", description: "", emoji: "⭐" },
      social: { title: "Платформы", links: [] },
      track:  { trackTitle: "Трек", trackUrl: "" },
      banner: { bannerText: "Новый баннер", bannerImage: "" },
    }[type]
    onUpdate({ ...card, blocks: [...card.blocks, { id, type, ...extras }] })
    setShowAddBlock(false)
  }

  const blockTypes: { type: BlockType; icon: string; label: string }[] = [
    { type: "text",   icon: "FileText", label: "Текст" },
    { type: "social", icon: "Share2",   label: "Соцсети" },
    { type: "track",  icon: "Music",    label: "Трек" },
    { type: "banner", icon: "Image",    label: "Баннер" },
  ]

  const s = card.style

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-2xl overflow-visible transition-colors duration-200 group ${sizeMap[card.size].cols} ${sizeMap[card.size].minH} ${isDragging ? "opacity-50 z-50" : ""}`}
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = s.hoverBorder)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = s.border)}
    >
      {/* Панель управления */}
      {isAdmin && (
        <div className="absolute -top-3 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button {...attributes} {...listeners} className="p-1 rounded-md bg-black/60 border border-white/15 text-white/40 hover:text-white/70 transition-all cursor-grab active:cursor-grabbing" title="Перетащить">
            <Icon name="GripVertical" size={12} />
          </button>
          {(["small", "medium", "large"] as const).map(sz => (
            <button key={sz} onClick={() => onUpdate({ ...card, size: sz })} className={`px-2 py-0.5 rounded-md text-xs border transition-all ${card.size === sz ? "bg-purple-500/40 border-purple-400/60 text-purple-200" : "bg-black/60 border-white/15 text-white/40 hover:text-white/70"}`}>
              {sizeMap[sz].label[0]}
            </button>
          ))}
          <button onClick={() => setShowSettings(v => !v)} className={`p-1 rounded-md border transition-all ${showSettings ? "bg-purple-500/40 border-purple-400/60 text-purple-200" : "bg-black/60 border-white/15 text-white/40 hover:text-white/70"}`} title="Цвета">
            <Icon name="Palette" size={12} />
          </button>
          <button onClick={() => setShowAddBlock(v => !v)} className="p-1 rounded-md bg-black/60 border border-white/15 text-white/40 hover:text-white/70 transition-all" title="Добавить блок">
            <Icon name="Plus" size={12} />
          </button>
          <button onClick={() => onDelete(card.id)} className="p-1 rounded-md bg-black/60 border border-white/15 text-red-400/50 hover:text-red-400 transition-all" title="Удалить плашку">
            <Icon name="Trash2" size={12} />
          </button>
        </div>
      )}

      {/* Редактор цветов */}
      {isAdmin && showSettings && (
        <div className="absolute top-4 right-0 z-30 w-64 shadow-2xl">
          <StyleEditor style={card.style} onChange={s => onUpdate({ ...card, style: s })} />
        </div>
      )}

      {/* Меню добавления блока */}
      {isAdmin && showAddBlock && (
        <div className="absolute top-4 right-0 z-30 w-44 bg-gray-900/95 border border-white/10 rounded-xl p-1.5 shadow-2xl">
          {blockTypes.map(bt => (
            <button key={bt.type} onClick={() => addBlock(bt.type)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all text-left">
              <Icon name={bt.icon} size={14} className="text-purple-400" />{bt.label}
            </button>
          ))}
        </div>
      )}

      {/* Блоки с drag-and-drop внутри */}
      <div className="p-4 flex flex-col gap-4">
        <DndContext sensors={blockSensors} collisionDetection={closestCenter} onDragEnd={handleBlockDragEnd}>
          <SortableContext items={card.blocks.map(b => b.id)} strategy={rectSortingStrategy}>
            {card.blocks.map(block => (
              <SortableBlock
                key={block.id}
                block={block}
                cardStyle={card.style}
                isAdmin={isAdmin}
                onUpdateBlock={updateBlock}
                onRemoveBlock={removeBlock}
              />
            ))}
          </SortableContext>
        </DndContext>
        {card.blocks.length === 0 && isAdmin && (
          <p className="text-white/20 text-xs text-center py-4">Плашка пустая — добавь блок ↑</p>
        )}
      </div>
    </div>
  )
}
