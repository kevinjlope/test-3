import * as React from "react"
import { type Product, type ProductImage } from "~/db/schema"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Link, type FetcherWithComponents } from "react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { cn } from "~/lib/utils"

interface ProductCardProps {
  product: Product & { images: ProductImage[] }
  deleteFetcher: FetcherWithComponents<any>
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export const ProductCard = React.memo(function ProductCard({ product, deleteFetcher }: ProductCardProps) {
  const primaryImage = product.images.slice().sort((a: ProductImage, b: ProductImage) => a.displayOrder - b.displayOrder)[0]
  
  const isDeleting = deleteFetcher.formData?.get("intent") === "delete" && 
                     deleteFetcher.formData?.get("productId") === product.id

  const [isOpen, setIsOpen] = React.useState(false)

  const handleDelete = () => {
    deleteFetcher.submit(
      { intent: "delete", productId: product.id },
      { method: "post" }
    )
    setIsOpen(false)
  }

  if (isDeleting) {
    return null
  }

  return (
    <Card data-testid="product-card" className="overflow-hidden transition-all hover:shadow-md group flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-square relative bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.thumbUrl || primaryImage.url}
              alt={primaryImage.altText}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
              No Image
            </div>
          )}
          <Badge className="absolute top-2 right-2 uppercase bg-background/80 backdrop-blur-xs text-[10px] h-5 border-none" variant="secondary">
            {product.category}
          </Badge>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button asChild variant="secondary" size="icon" className="rounded-full shadow-lg h-9 w-9">
              <Link to={`/products/${product.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="destructive" size="icon" className="rounded-full shadow-lg h-9 w-9" onClick={() => setIsOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-7 w-7 -mr-2 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-hidden transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/products/${product.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setIsOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-baseline justify-between w-full border-t pt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(product.priceCents)}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              / {product.unitOfSale}
            </span>
          </div>
          <span className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-tighter",
            product.stockQuantity > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} stock` : "Out of stock"}
          </span>
        </div>
      </CardFooter>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move "{product.name}" to trash. You can undo this action within 5 seconds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
})
