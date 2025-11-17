import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (

      <div className="max-w-5xl mx-auto py-10 space-y-10">
        {/* Page title skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-7 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Recent members skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
  );
}