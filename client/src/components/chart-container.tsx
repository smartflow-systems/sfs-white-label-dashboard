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
    <Card data-testid={`card-chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{timeRange}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-chart-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRefresh} data-testid="button-refresh-chart">
              Refresh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport} data-testid="button-export-chart">
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
