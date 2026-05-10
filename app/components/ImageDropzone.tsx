import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      onChange(arrayMove(images, oldIndex, newIndex))
    }
  }

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
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
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
              />
            ))}
            {images.length === 0 && (
              <div className="col-span-full flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <p>No images added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
