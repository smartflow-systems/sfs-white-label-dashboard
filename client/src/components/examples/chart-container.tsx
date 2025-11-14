import { ChartContainer } from '../chart-container';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartContainerExample() {
  const mockData = [
    { date: 'Nov 8', value: 4200 },
    { date: 'Nov 9', value: 3800 },
    { date: 'Nov 10', value: 4500 },
    { date: 'Nov 11', value: 5200 },
    { date: 'Nov 12', value: 4900 },
    { date: 'Nov 13', value: 5800 },
    { date: 'Nov 14', value: 6200 },
  ];

  return (
    <div className="p-6 space-y-6">
      <ChartContainer
        title="API Requests"
        timeRange="Last 7 days"
        onExport={() => console.log('Export chart data')}
        onRefresh={() => console.log('Refresh chart')}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
