import { ChartContainer } from "@/components/chart-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Analytics() {
  const userGrowthData = [
    { month: 'Jun', users: 2100, active: 1680 },
    { month: 'Jul', users: 2350, active: 1880 },
    { month: 'Aug', users: 2580, active: 2064 },
    { month: 'Sep', users: 2420, active: 1936 },
    { month: 'Oct', users: 2650, active: 2120 },
    { month: 'Nov', users: 2847, active: 2278 },
  ];

  const deviceBreakdown = [
    { name: 'Desktop', value: 1245, color: 'hsl(var(--chart-1))' },
    { name: 'Mobile', value: 982, color: 'hsl(var(--chart-2))' },
    { name: 'Tablet', value: 620, color: 'hsl(var(--chart-3))' },
  ];

  const topEndpoints = [
    { endpoint: '/api/users', calls: 45231, avgTime: 142 },
    { endpoint: '/api/analytics', calls: 32145, avgTime: 189 },
    { endpoint: '/api/dashboard', calls: 28934, avgTime: 156 },
    { endpoint: '/api/reports', calls: 21543, avgTime: 234 },
    { endpoint: '/api/settings', calls: 18765, avgTime: 98 },
  ];

  const performanceData = [
    { time: '00:00', success: 98.5, error: 1.5 },
    { time: '04:00', success: 99.2, error: 0.8 },
    { time: '08:00', success: 97.8, error: 2.2 },
    { time: '12:00', success: 96.5, error: 3.5 },
    { time: '16:00', success: 97.2, error: 2.8 },
    { time: '20:00', success: 98.8, error: 1.2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deep dive into usage patterns and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="User Growth"
          timeRange="Last 6 months"
          onExport={() => console.log('Export user growth data')}
          onRefresh={() => console.log('Refresh user growth')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--popover-border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="active"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Device Distribution"
          timeRange="Current month"
          onExport={() => console.log('Export device data')}
          onRefresh={() => console.log('Refresh device data')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--popover-border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer
        title="Success Rate"
        timeRange="Last 24 hours"
        onExport={() => console.log('Export success rate data')}
        onRefresh={() => console.log('Refresh success rate')}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--popover-border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="success" stackId="a" fill="hsl(var(--chart-3))" name="Success Rate" />
            <Bar dataKey="error" stackId="a" fill="hsl(var(--destructive))" name="Error Rate" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Card data-testid="card-top-endpoints">
        <CardHeader>
          <CardTitle className="text-lg">Top API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEndpoints.map((endpoint, index) => (
              <div
                key={endpoint.endpoint}
                className="flex items-center justify-between p-4 rounded-md border hover-elevate"
                data-testid={`row-endpoint-${index}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                    <p className="text-xs text-muted-foreground mt-1">
                      {endpoint.calls.toLocaleString()} calls
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-mono">{endpoint.avgTime}ms</div>
                    <p className="text-xs text-muted-foreground">avg time</p>
                  </div>
                  <Badge variant="outline">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
