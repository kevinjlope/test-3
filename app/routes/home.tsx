import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, Link, useFetcher } from "react-router";
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

export const meta: MetaFunction = () => {
  return [
    { title: "Fifty Flowers - Catalog Management" },
    { name: "description", content: "Manage flower products efficiently." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") || undefined;
  const categories = url.searchParams.getAll("category") as Category[];

  const products = await ProductService.getProducts({
    search,
    categories: categories.length > 0 ? categories : undefined,
  });

  return { products };
}

export async function action({ request }: ActionFunctionArgs) {
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
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      if (fetcher.data.intent === "delete") {
        const productId = fetcher.data.productId;
        toast.success("Product deleted", {
          action: {
            label: "Undo",
            onClick: () => {
              const formData = new FormData();
              formData.append("intent", "restore");
              formData.append("productId", productId);
              fetcher.submit(formData, { method: "post" });
            },
          },
        });
      } else if (fetcher.data.intent === "restore") {
        toast.success("Product restored");
      }
    }
  }, [fetcher.data]);

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
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link to="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <CatalogSearch />
          <CategoryFilter />
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
