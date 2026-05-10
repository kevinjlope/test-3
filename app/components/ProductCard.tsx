import * as React from "react"
import { type Product, type ProductImage } from "~/db/schema"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button, buttonVariants } from "~/components/ui/button"
import { Edit2, Trash2, AlertTriangle } from "lucide-react"
import { Link, useFetcher } from "react-router"
import { cn } from "~/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

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
  const [isOpen, setIsOpen] = React.useState(false)
  
  const isDeleting = fetcher.formData?.get("intent") === "delete" && 
                     fetcher.formData?.get("productId") === product.id

  const handleDelete = () => {
    fetcher.submit(
      { intent: "delete", productId: product.id },
      { method: "post" }
    )
    setIsOpen(false)
  }

  if (isDeleting) {
    return null
  }

  return (
    <Card data-testid="product-card" className="overflow-hidden transition-all hover:shadow-md group">
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
            <Link 
              to={`/products/${product.id}/edit`}
              className={cn(buttonVariants({ size: "icon", variant: "secondary" }), "h-9 w-9")}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger
                render={
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-9 w-9"
                  />
                }
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center text-center pt-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <DialogTitle className="text-xl">Delete Product</DialogTitle>
                  <DialogDescription className="text-balance text-muted-foreground">
                    Are you sure you want to delete <span className="font-semibold text-foreground">{product.name}</span>? 
                    This action will hide it from the catalog but you can undo it later.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center gap-3 p-6 pt-2">
                  <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-none">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="flex-1 sm:flex-none px-8">
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
