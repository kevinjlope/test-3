import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "~/lib/utils"

interface SortableImageProps {
  id: string
  url: string
  altText: string
  onRemove: () => void
  onAltChange: (value: string) => void
  isDragging?: boolean
  isOverlay?: boolean
}

export function SortableImage({ 
  id, 
  url, 
  altText, 
  onRemove, 
  onAltChange,
  isDragging,
  isOverlay 
}: SortableImageProps) {
  const animateLayoutChanges = (args: any) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id,
    animateLayoutChanges
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isOverlay ? 100 : 0,
    position: 'relative' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm",
        isOverlay && "shadow-xl border-primary ring-2 ring-primary/20",
        isDragging && !isOverlay && "invisible"
      )}
    >
      <div className="group relative aspect-video overflow-hidden rounded-md bg-muted">
        <img
          src={url}
          alt={altText}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
          <span className="sr-only">Drag to reorder</span>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`alt-${id}-${isOverlay ? 'overlay' : 'base'}`} className="text-xs">Alt Text (Mandatory)</Label>
        <Input
          id={`alt-${id}-${isOverlay ? 'overlay' : 'base'}`}
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Describe the image..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  )
}
