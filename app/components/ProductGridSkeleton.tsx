import * as React from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-0">
            <Skeleton className="aspect-square w-full" />
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
