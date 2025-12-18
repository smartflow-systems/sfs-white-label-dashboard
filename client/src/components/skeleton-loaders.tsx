import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function MetricCardSkeleton() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 skeleton-gold" />
          <Skeleton className="h-8 w-8 rounded-md skeleton-gold" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2 skeleton-gold" />
        <Skeleton className="h-3 w-40 skeleton-gold" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 skeleton-gold" />
            <Skeleton className="h-3 w-32 skeleton-gold" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md skeleton-gold" />
            <Skeleton className="h-8 w-8 rounded-md skeleton-gold" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-between gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 skeleton-gold"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 skeleton-gold" />
          <Skeleton className="h-9 w-32 rounded-md skeleton-gold" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table header */}
          <div className="flex gap-4 pb-3 border-b border-border-gold">
            <Skeleton className="h-4 w-32 skeleton-gold" />
            <Skeleton className="h-4 w-48 flex-1 skeleton-gold" />
            <Skeleton className="h-4 w-24 skeleton-gold" />
            <Skeleton className="h-4 w-24 skeleton-gold" />
          </div>
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              <Skeleton className="h-4 w-32 skeleton-gold" />
              <Skeleton className="h-4 w-48 flex-1 skeleton-gold" />
              <Skeleton className="h-4 w-24 skeleton-gold" />
              <Skeleton className="h-4 w-24 skeleton-gold" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Skeleton className="h-8 w-48 mb-2 skeleton-gold" />
        <Skeleton className="h-4 w-96 skeleton-gold" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <ChartSkeleton />
    </div>
  );
}

export function ListSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="glass-card hover-elevate-gold">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full skeleton-gold" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 skeleton-gold" />
                <Skeleton className="h-3 w-1/2 skeleton-gold" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md skeleton-gold" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full skeleton-gold" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-48 skeleton-gold" />
        <Skeleton className="h-4 w-32 skeleton-gold" />
      </div>
    </div>
  );
}
