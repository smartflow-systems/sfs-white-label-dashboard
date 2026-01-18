import { Card } from "@/components/ui/card";

export function MetricCardSkeleton() {
  return (
    <Card className="glass-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton-gold h-4 w-24 rounded" />
        <div className="skeleton-gold h-8 w-8 rounded-lg" />
      </div>
      <div className="skeleton-gold h-8 w-32 rounded mb-2" />
      <div className="skeleton-gold h-3 w-40 rounded" />
    </Card>
  );
}

export function ChartContainerSkeleton() {
  return (
    <Card className="glass-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="skeleton-gold h-5 w-48 rounded mb-2" />
          <div className="skeleton-gold h-3 w-32 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton-gold h-8 w-8 rounded" />
          <div className="skeleton-gold h-8 w-8 rounded" />
        </div>
      </div>
      <div className="skeleton-gold h-64 w-full rounded-lg" />
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="glass-card overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border">
        <div className="skeleton-gold h-5 w-48 rounded" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="skeleton-gold h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-gold h-4 w-3/4 rounded" />
              <div className="skeleton-gold h-3 w-1/2 rounded" />
            </div>
            <div className="skeleton-gold h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="skeleton-gold h-10 w-64 rounded" />
        <div className="skeleton-gold h-4 w-96 rounded" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainerSkeleton />
        <ChartContainerSkeleton />
      </div>
      <ChartContainerSkeleton />
    </div>
  );
}
