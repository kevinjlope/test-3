import { type ActionFunctionArgs, redirect } from "react-router"
import { ProductService } from "~/services/ProductService"
import { ProductForm, type ProductFormValues } from "~/components/ProductForm"
import { MainLayout } from "~/components/layout/MainLayout"
import { toast } from "sonner"
import { useSubmit, useNavigation } from "react-router"

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = JSON.parse(formData.get("data") as string) as ProductFormValues

  try {
    const productData = {
      name: data.name,
      priceCents: Math.round(data.price * 100),
      stockQuantity: data.stockQuantity,
      unitOfSale: data.unitOfSale,
      category: data.category,
      description: data.description,
    }

    const imagesData = data.images.map((img, index) => ({
      url: img.url,
      altText: img.altText,
      displayOrder: index,
    }))

    await ProductService.createProduct(productData, imagesData)
    return redirect("/")
  } catch (error: any) {
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
