import * as React from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

export function CatalogSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== (searchParams.get("q") || "")) {
        startTransition(() => {
          setSearchParams(
            (prev) => {
              if (query) {
                prev.set("q", query);
              } else {
                prev.delete("q");
              }
              return prev;
            },
            { replace: true }
          );
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchParams, setSearchParams]);

  // Sync state with search params if they change externally (e.g. back button)
  React.useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
