import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { categoryEnum, unitOfSaleEnum, type Category, type UnitOfSale } from "~/db/schema"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ImageDropzone } from "./ImageDropzone"
import { Loader2 } from "lucide-react"

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(80, "Name must be at most 80 characters"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  stockQuantity: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
  unitOfSale: z.enum(unitOfSaleEnum),
  category: z.enum(categoryEnum),
  description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be at most 200 characters"),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url("Invalid URL"),
    altText: z.string().min(1, "Alt text is mandatory"),
  })).min(1, "At least one image is required"),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function ProductForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stockQuantity: 0,
      unitOfSale: "stem",
      category: "roses",
      description: "",
      images: [],
      ...initialValues,
    },
  })

  const images = watch("images")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g. Red Roses"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryEnum.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="0.00"
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="unitOfSale">Unit of Sale</Label>
          <Controller
            name="unitOfSale"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="unitOfSale">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOfSaleEnum.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.unitOfSale && <p className="text-sm text-destructive">{errors.unitOfSale.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            {...register("stockQuantity")}
            placeholder="0"
          />
          {errors.stockQuantity && <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe your flower product..."
          className="min-h-[100px]"
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-4">
        <ImageDropzone
          images={images}
          onChange={(newImages) => setValue("images", newImages, { shouldValidate: true })}
        />
        {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
