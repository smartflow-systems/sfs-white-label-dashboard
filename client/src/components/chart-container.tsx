import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  timeRange?: string;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function ChartContainer({
  title,
  children,
  timeRange = "Last 7 days",
  onExport,
  onRefresh,
}: ChartContainerProps) {
  return (
    <Card
      className="glass-card hover-elevate-gold animate-slide-up"
      data-testid={`card-chart-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg text-gold-shimmer">{title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{timeRange}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover-elevate-gold"
              data-testid={`button-chart-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card">
            <DropdownMenuItem
              onClick={onRefresh}
              className="hover-elevate-gold cursor-pointer"
              data-testid="button-refresh-chart"
            >
              Refresh
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onExport}
              className="hover-elevate-gold cursor-pointer"
              data-testid="button-export-chart"
            >
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="h-80">
        {children}
      </CardContent>
    </Card>
  );
}
