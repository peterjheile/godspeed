import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
    {/* Header skeleton */}
    <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
    </div>

    {/* Member cards skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            </CardHeader>
            <CardContent>
            <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
        ))}
    </div>
    </div>
  );
}