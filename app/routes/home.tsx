import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, Link, useFetcher, useSearchParams, useFetchers } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";
import { ProductCard } from "~/components/ProductCard";
import { CatalogSearch } from "~/components/CatalogSearch";
import { CategoryFilter } from "~/components/CategoryFilter";
import { ProductService } from "~/services/ProductService";
import { type Category } from "~/db/schema";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const meta: MetaFunction = () => {
  return [
    { title: "Fifty Flowers - Catalog Management" },
    { name: "description", content: "Manage flower products efficiently." },
  ];
};

interface ActionData {
  success: boolean;
  intent: "delete" | "restore";
  productId: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || undefined;
  const categories = url.searchParams.getAll("category") as Category[];
  const sortBy = (url.searchParams.get("sortBy") as "name" | "price" | "createdAt") || undefined;
  const sortOrder = (url.searchParams.get("sortOrder") as "asc" | "desc") || undefined;

  const products = await ProductService.getProducts({
    search,
    categories: categories.length > 0 ? categories : undefined,
    sortBy,
    sortOrder,
  });

  return { products };
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const shouldFail = url.searchParams.get("fail") === "1";
  
  if (shouldFail) {
    // Artificial delay to see optimistic UI rollback
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: false, error: "Simulated rollback error", intent: "delete" };
  }

  const formData = await request.formData();
  const intent = formData.get("intent");
  const productId = formData.get("productId") as string;

  if (intent === "delete") {
    await ProductService.softDelete(productId);
    return { success: true, intent: "delete", productId };
  }

  if (intent === "restore") {
    await ProductService.restore(productId);
    return { success: true, intent: "restore", productId };
  }

  return { success: false };
}

export default function Home() {
  const { products } = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const deleteFetcher = useFetcher();
  const restoreFetcher = useFetcher();

  // Listen for deletions to show Undo toast
  useEffect(() => {
    const data = deleteFetcher.data as ActionData | any;
    if (data?.success && data.intent === "delete") {
      toast.success("Product moved to trash", {
        action: {
          label: "Undo",
          onClick: () => {
            restoreFetcher.submit(
              { intent: "restore", productId: data.productId },
              { method: "post" }
            );
          },
        },
        duration: 5000,
      });
    } else if (data?.success === false && data?.error) {
      toast.error(data.error);
    }
  }, [deleteFetcher.data]);

  // Listen for restores
  useEffect(() => {
    const data = restoreFetcher.data as ActionData | any;
    if (data?.success && data.intent === "restore") {
      toast.success("Product restored successfully");
    }
  }, [restoreFetcher.data]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your flower catalog, stock, and pricing.
            </p>
          </div>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 flex flex-row items-center gap-2 whitespace-nowrap"
          >
            <Link to="/products/new">
              <Plus className="h-4 w-4 shrink-0" />
              <span>Add Product</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <CatalogSearch />
          <CategoryFilter />
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <SortSelect />
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                deleteFetcher={deleteFetcher}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button asChild variant="outline">
              <Link to="/products/new">Add your first product</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

function SortSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const currentValue = `${sortBy}-${sortOrder}`;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", newSortBy);
    newParams.set("sortOrder", newSortOrder);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <Select value={currentValue} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {SORT_OPTIONS.find(opt => opt.value === currentValue)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
