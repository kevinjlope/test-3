import * as React from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { Plus, Link as LinkIcon } from "lucide-react"
import { SortableImage } from "./SortableImage"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ImageItem {
  id: string
  url: string
  altText: string
}

interface ImageDropzoneProps {
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
}

export function ImageDropzone({ images, onChange }: ImageDropzoneProps) {
  const [newUrl, setNewUrl] = React.useState("")
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddImage = () => {
    if (!newUrl) return
    try {
      new URL(newUrl)
      onChange([...images, { id: crypto.randomUUID(), url: newUrl, altText: "" }])
      setNewUrl("")
    } catch (e) {
      alert("Please enter a valid URL")
    }
  }

  const handleRemoveImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id))
  }

  const handleAltChange = (id: string, altText: string) => {
    onChange(
      images.map((img) => (img.id === id ? { ...img, altText } : img))
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log('Drag End:', { activeId: active.id, overId: over?.id });
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      console.log('Moving from', oldIndex, 'to', newIndex);
      const newImages = arrayMove(images, oldIndex, newIndex);
      onChange(newImages)
    }
  }

  const activeImage = activeId ? images.find(img => img.id === activeId) : null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Paste image URL here..."
              className="pl-9"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddImage()
                }
              }}
            />
          </div>
          <Button type="button" onClick={handleAddImage} variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
        <p className="text-[0.8rem] text-muted-foreground">
          Multiple images allowed. Drag to reorder. First image will be primary.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                id={image.id}
                url={image.url}
                altText={image.altText}
                onRemove={() => handleRemoveImage(image.id)}
                onAltChange={(val) => handleAltChange(image.id, val)}
                isDragging={activeId === image.id}
              />
            ))}
            {images.length === 0 && (
              <div className="col-span-full flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <p>No images added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
        <DragOverlay adjustScale={true}>
          {activeImage ? (
            <SortableImage
              id={activeImage.id}
              url={activeImage.url}
              altText={activeImage.altText}
              onRemove={() => {}}
              onAltChange={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
