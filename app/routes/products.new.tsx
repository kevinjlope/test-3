import { type ActionFunctionArgs, redirect } from "react-router"
import { ProductService } from "~/services/ProductService"
import { ProductForm, productSchema, type ProductFormValues } from "~/components/ProductForm"
import { MainLayout } from "~/components/layout/MainLayout"
import { toast } from "sonner"
import { useSubmit, useNavigation } from "react-router"

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const rawData = JSON.parse(formData.get("data") as string)

  try {
    const validatedSchema = productSchema.refine(
      async (data) => await ProductService.checkNameUniqueness(data.name),
      { message: "Product name must be unique", path: ["name"] }
    )

    const data = await validatedSchema.parseAsync(rawData)

    const productData = {
      id: crypto.randomUUID(),
      name: data.name,
      priceCents: Math.round(data.price * 100),
      stockQuantity: data.stockQuantity,
      unitOfSale: data.unitOfSale,
      category: data.category,
      description: data.description,
    }

    const imagesData = data.images.map((img, index) => ({
      id: crypto.randomUUID(),
      url: img.url,
      altText: img.altText,
      displayOrder: index,
    }))

    await ProductService.createProduct(productData, imagesData)
    return redirect("/")
  } catch (error: any) {
    if (error.name === "ZodError") {
      return { error: error.errors[0].message }
    }
    return { error: error.message || "Failed to create product" }
  }
}

export default function NewProductPage() {
  const submit = useSubmit()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const handleSubmit = (values: ProductFormValues) => {
    submit(
      { data: JSON.stringify(values) },
      { method: "post" }
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
          <p className="text-muted-foreground">Add a new flower product to the catalog.</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Product"
          />
        </div>
      </div>
    </MainLayout>
  )
}
