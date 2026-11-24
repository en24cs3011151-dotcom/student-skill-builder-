import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ProgressHistoryEntry, WeeklyActivityEntry } from '../types';

export function WeeklyActivityChart({
  data,
  height = 240,
}: {
  data: WeeklyActivityEntry[];
  height?: number;
}) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            unit="m"
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)' }}
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#1e293b' : '#e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '12px',
              color: isDark ? '#f8fafc' : '#0f172a',
            }}
            formatter={(value) => [`${value ?? 0} min`, 'Study Time']}
          />
          <Bar
            dataKey="minutes"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressTrendChart({
  data,
  height = 260,
}: {
  data: ProgressHistoryEntry[];
  height?: number;
}) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="xpAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
          />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#1e293b' : '#e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '12px',
              color: isDark ? '#f8fafc' : '#0f172a',
            }}
            formatter={(value, name) => [
              name === 'xp' ? `${value ?? 0} XP` : `${value ?? 0} hrs`,
              name === 'xp' ? 'Cumulative XP' : 'Study Hours',
            ]}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="url(#xpAreaFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
