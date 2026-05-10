import * as React from "react"
import { type Product, type ProductImage } from "app/db/schema"
import { Card, CardContent, CardFooter, CardHeader } from "app/components/ui/card"
import { Badge } from "app/components/ui/badge"
import { Button } from "app/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { Link, useFetcher } from "react-router"

interface ProductCardProps {
  product: Product & { images: ProductImage[] }
}

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.slice().sort((a: ProductImage, b: ProductImage) => a.displayOrder - b.displayOrder)[0]
  const fetcher = useFetcher()
  
  const isDeleting = fetcher.formData?.get("intent") === "delete" && 
                     fetcher.formData?.get("productId") === product.id

  if (isDeleting) {
    return null
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <CardHeader className="p-0">
        <div className="aspect-square relative bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <Badge className="absolute top-2 right-2 uppercase bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none" variant="secondary">
            {product.category}
          </Badge>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button asChild size="icon" variant="secondary" className="h-9 w-9">
              <Link to={`/products/${product.id}/edit`}>
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button 
              size="icon" 
              variant="destructive" 
              className="h-9 w-9"
              onClick={() => {
                if (confirm("Are you sure you want to delete this product?")) {
                  fetcher.submit(
                    { intent: "delete", productId: product.id },
                    { method: "post" }
                  )
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold leading-none tracking-tight group-hover:text-emerald-700 transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold">
            {formatPrice(product.priceCents)}
            <span className="text-sm font-normal text-muted-foreground"> / {product.unitOfSale}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
})
