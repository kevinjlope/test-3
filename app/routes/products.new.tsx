import { type ActionFunctionArgs, redirect, useActionData } from "react-router"
import { ProductService } from "~/services/ProductService"
import { ImageService } from "~/services/ImageService"
import { ProductForm, productFormSchema, type ProductFormValues } from "~/components/ProductForm"
import { MainLayout } from "~/components/layout/MainLayout"
import { useSubmit, useNavigation } from "react-router"

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  if (url.searchParams.get("fail") === "1") {
    return { error: "Simulated server error for rollback testing" }
  }

  const formData = await request.formData()
  
  try {
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10)
    const unitOfSale = formData.get("unitOfSale") as any
    const category = formData.get("category") as any
    const description = formData.get("description") as string
    const imagesMeta = JSON.parse(formData.get("images_meta") as string)
    const imageFiles = formData.getAll("image_files") as File[]

    // 1. Validate name uniqueness early
    const isUnique = await ProductService.checkNameUniqueness(name)
    if (!isUnique) {
      return { error: "Product name must be unique" }
    }

    // 2. Process images (Parallel for performance)
    let fileIndex = 0
    const processedImages = await Promise.all(imagesMeta.map(async (meta: any, index: number) => {
      if (meta.hasFile) {
        const file = imageFiles[fileIndex++]
        const { url, thumbUrl } = await ImageService.processImage(file)
        return {
          id: crypto.randomUUID(),
          url,
          thumbUrl,
          altText: meta.altText,
          displayOrder: index
        }
      } else {
        return {
          id: crypto.randomUUID(),
          url: meta.url,
          altText: meta.altText,
          displayOrder: index
        }
      }
    }))

    const productData = {
      id: crypto.randomUUID(),
      name,
      priceCents: Math.round(price * 100),
      stockQuantity,
      unitOfSale,
      category,
      description,
    }

    await ProductService.createProduct(productData, processedImages)
    return redirect("/")
  } catch (error: any) {
    console.error("Action error:", error)
    return { error: error.message || "Failed to create product" }
  }
}

export default function NewProductPage() {
  const submit = useSubmit()
  const navigation = useNavigation()
  const actionData = useActionData<{ error?: string }>()
  const isSubmitting = navigation.state === "submitting"

  const handleSubmit = (values: ProductFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("price", values.price.toString())
    formData.append("stockQuantity", values.stockQuantity.toString())
    formData.append("unitOfSale", values.unitOfSale)
    formData.append("category", values.category)
    formData.append("description", values.description)

    const imagesMeta = values.images.map((img) => {
      if (img.file) {
        formData.append("image_files", img.file)
        return { id: img.id, altText: img.altText, hasFile: true }
      }
      return { id: img.id, altText: img.altText, url: img.url, hasFile: false }
    })
    formData.append("images_meta", JSON.stringify(imagesMeta))

    submit(formData, { method: "post", encType: "multipart/form-data" })
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
          <p className="text-muted-foreground text-lg">Add a new flower product to your catalog with optimized media.</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Product"
            serverError={actionData?.error}
          />
        </div>
      </div>
    </MainLayout>
  )
}
