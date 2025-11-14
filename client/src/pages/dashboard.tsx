import { MetricCard } from "@/components/metric-card";
import { ChartContainer } from "@/components/chart-container";
import { Users, DollarSign, Activity, TrendingUp, Database, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const apiRequestsData = [
    { date: 'Nov 8', requests: 4200, errors: 45 },
    { date: 'Nov 9', requests: 3800, errors: 32 },
    { date: 'Nov 10', requests: 4500, errors: 28 },
    { date: 'Nov 11', requests: 5200, errors: 51 },
    { date: 'Nov 12', requests: 4900, errors: 38 },
    { date: 'Nov 13', requests: 5800, errors: 42 },
    { date: 'Nov 14', requests: 6200, errors: 35 },
  ];

  const revenueData = [
    { month: 'Jun', revenue: 32000 },
    { month: 'Jul', revenue: 38000 },
    { month: 'Aug', revenue: 42000 },
    { month: 'Sep', revenue: 39000 },
    { month: 'Oct', revenue: 45000 },
    { month: 'Nov', revenue: 52000 },
  ];

  const latencyData = [
    { time: '00:00', avg: 120, p95: 180, p99: 250 },
    { time: '04:00', avg: 95, p95: 145, p99: 210 },
    { time: '08:00', avg: 145, p95: 220, p99: 310 },
    { time: '12:00', avg: 165, p95: 245, p99: 340 },
    { time: '16:00', avg: 155, p95: 230, p99: 320 },
    { time: '20:00', avg: 130, p95: 195, p99: 270 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your API performance and business metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="2,847"
          trend={12.5}
          trendLabel="from last month"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Revenue"
          value="$52,231"
          trend={8.2}
          trendLabel="from last month"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="API Requests"
          value="6,200"
          trend={15.3}
          trendLabel="from yesterday"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Avg Latency"
          value="142ms"
          trend={-5.1}
          trendLabel="improvement"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="API Requests & Errors"
          timeRange="Last 7 days"
          onExport={() => console.log('Export API requests data')}
          onRefresh={() => console.log('Refresh API requests')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={apiRequestsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
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
                dataKey="requests"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Revenue Trend"
          timeRange="Last 6 months"
          onExport={() => console.log('Export revenue data')}
          onRefresh={() => console.log('Refresh revenue')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
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
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer
        title="API Latency Distribution"
        timeRange="Last 24 hours"
        onExport={() => console.log('Export latency data')}
        onRefresh={() => console.log('Refresh latency')}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--popover-border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => `${value}ms`}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="avg" fill="hsl(var(--chart-3))" name="Average" />
            <Bar dataKey="p95" fill="hsl(var(--chart-4))" name="P95" />
            <Bar dataKey="p99" fill="hsl(var(--chart-5))" name="P99" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
