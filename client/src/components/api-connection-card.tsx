import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiConnectionCardProps {
  serviceName: string;
  status: "connected" | "error" | "pending";
  lastSync?: Date;
  requestCount?: number;
  avgLatency?: number;
  icon?: React.ReactNode;
  onConfigure?: () => void;
  onTest?: () => void;
}

export function ApiConnectionCard({
  serviceName,
  status,
  lastSync,
  requestCount,
  avgLatency,
  icon,
  onConfigure,
  onTest,
}: ApiConnectionCardProps) {
  const getStatusBadge = () => {
    const variants = {
      connected: "default",
      error: "destructive",
      pending: "secondary",
    } as const;

    const labels = {
      connected: "Connected",
      error: "Error",
      pending: "Pending",
    };

    return (
      <Badge variant={variants[status]} data-testid={`badge-status-${serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card className="hover-elevate" data-testid={`card-connection-${serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <CardTitle className="text-base">{serviceName}</CardTitle>
            {lastSync && (
              <p className="text-xs text-muted-foreground mt-1">
                Last sync: {lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            {requestCount !== undefined && (
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{requestCount.toLocaleString()}</span>
                <span className="text-muted-foreground">requests</span>
              </div>
            )}
            {avgLatency !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{avgLatency}ms</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigure}
            className="flex-1"
            data-testid={`button-configure-${serviceName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onTest}
            data-testid={`button-test-${serviceName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
