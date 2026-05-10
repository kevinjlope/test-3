import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect, useActionData } from "react-router"
import { ProductService } from "~/services/ProductService"
import { ImageService } from "~/services/ImageService"
import { ProductForm, productFormSchema, type ProductFormValues } from "~/components/ProductForm"
import { MainLayout } from "~/components/layout/MainLayout"
import { useLoaderData, useSubmit, useNavigation } from "react-router"

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) throw new Error("Product ID is required")

  const product = await ProductService.getProductById(id)
  if (!product) {
    throw new Response("Product Not Found", { status: 404 })
  }

  return { product }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params
  if (!id) throw new Error("Product ID is required")

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

    // 1. Validate uniqueness
    const isUnique = await ProductService.checkNameUniqueness(name, id)
    if (!isUnique) {
      return { error: "Product name must be unique" }
    }

    // 2. Process images
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
        // For existing images, we keep the original ID if possible or generate new one
        return {
          id: meta.id.startsWith("new-") ? crypto.randomUUID() : meta.id,
          url: meta.url,
          altText: meta.altText,
          displayOrder: index
        }
      }
    }))

    const productData = {
      name,
      priceCents: Math.round(price * 100),
      stockQuantity,
      unitOfSale,
      category,
      description,
    }

    await ProductService.updateProduct(id, productData, processedImages)
    return redirect("/")
  } catch (error: any) {
    console.error("Action error:", error)
    return { error: error.message || "Failed to update product" }
  }
}

export default function EditProductPage() {
  const { product } = useLoaderData<typeof loader>()
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

  const initialValues: ProductFormValues = {
    name: product.name,
    price: product.priceCents / 100,
    stockQuantity: product.stockQuantity,
    unitOfSale: product.unitOfSale,
    category: product.category,
    description: product.description,
    images: product.images.map(img => ({
      id: img.id,
      url: img.url,
      altText: img.altText
    }))
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground text-lg">Update "{product.name}" details and media.</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ProductForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Update Product"
            serverError={actionData?.error}
          />
        </div>
      </div>
    </MainLayout>
  )
}
