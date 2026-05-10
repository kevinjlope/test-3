import * as React from "react";
import { useSearchParams } from "react-router";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { categoryEnum, type Category } from "~/db/schema";

export function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategories = new Set(searchParams.getAll("category") as Category[]);
  const [isPending, startTransition] = React.useTransition();

  const toggleCategory = (category: Category) => {
    startTransition(() => {
      setSearchParams(
        (prev) => {
          const current = prev.getAll("category");
          if (current.includes(category)) {
            const next = current.filter((c) => c !== category);
            prev.delete("category");
            next.forEach((c) => prev.append("category", c));
          } else {
            prev.append("category", category);
          }
          return prev;
        },
        { replace: true }
      );
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearchParams(
        (prev) => {
          prev.delete("category");
          return prev;
        },
        { replace: true }
      );
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Categories
        {selectedCategories.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedCategories.size}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selectedCategories.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedCategories.size} selected
                </Badge>
              ) : (
                Array.from(selectedCategories).map((category) => (
                  <Badge
                    variant="secondary"
                    key={category}
                    className="rounded-sm px-1 font-normal"
                  >
                    {category}
                  </Badge>
                ))
              )}
            </div>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Category" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {categoryEnum.map((category) => {
                const isSelected = selectedCategories.has(category);
                return (
                  <CommandItem
                    key={category}
                    onSelect={() => toggleCategory(category)}
                    data-checked={isSelected}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span className="capitalize">{category}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedCategories.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
