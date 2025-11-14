import { MetricCard } from '../metric-card';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <MetricCard
        title="Total Users"
        value="2,847"
        trend={12.5}
        trendLabel="from last month"
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Revenue"
        value="$45,231"
        trend={8.2}
        trendLabel="from last month"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Active Sessions"
        value="1,234"
        trend={-3.1}
        trendLabel="from yesterday"
        icon={<Activity className="h-4 w-4" />}
      />
      <MetricCard
        title="Conversion Rate"
        value="3.24%"
        trend={5.7}
        trendLabel="from last week"
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  );
}
