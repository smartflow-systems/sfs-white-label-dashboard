import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, trendLabel, icon }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return "";
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card
      className="glass-card hover-elevate-gold animate-slide-up"
      data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gold">{title}</CardTitle>
        {icon && (
          <div className="p-2 rounded-md bg-gradient-gold-subtle text-gold">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="text-3xl font-bold text-gold-shimmer"
          data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {value}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {getTrendIcon()}
            <span className={cn("font-medium", getTrendColor())}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
