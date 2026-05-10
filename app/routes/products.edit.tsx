import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect, useActionData } from "react-router"
import { ProductService } from "~/services/ProductService"
import { ProductForm, productSchema, type ProductFormValues } from "~/components/ProductForm"
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

  const url = new URL(request.url)
  const shouldFail = url.searchParams.get("fail") === "1"
  
  if (shouldFail) {
    // Artificial delay to see optimistic UI
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { error: "Simulated server error for rollback testing" }
  }

  const formData = await request.formData()
  const rawData = JSON.parse(formData.get("data") as string)

  try {
    const validatedSchema = productSchema.refine(
      async (data) => await ProductService.checkNameUniqueness(data.name, id),
      { message: "Product name must be unique", path: ["name"] }
    )

    const data = await validatedSchema.parseAsync(rawData)

    const productData = {
      name: data.name,
      priceCents: Math.round(data.price * 100),
      stockQuantity: data.stockQuantity,
      unitOfSale: data.unitOfSale,
      category: data.category,
      description: data.description,
    }

    const imagesData = data.images.map((img, index) => ({
      id: img.id.startsWith("new-") ? crypto.randomUUID() : img.id,
      url: img.url,
      altText: img.altText,
      displayOrder: index,
    }))

    await ProductService.updateProduct(id, productData, imagesData)
    return redirect("/")
  } catch (error: any) {
    if (error.name === "ZodError" && error.issues && error.issues.length > 0) {
      return { error: error.issues[0].message }
    }
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
    submit(
      { data: JSON.stringify(values) },
      { method: "post" }
    )
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
    })).sort((a, b) => {
      const imgA = product.images.find(i => i.id === a.id)
      const imgB = product.images.find(i => i.id === b.id)
      return (imgA?.displayOrder || 0) - (imgB?.displayOrder || 0)
    })
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update the details for "{product.name}".</p>
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
