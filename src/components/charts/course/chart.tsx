import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CourseChartSample } from '@/charts/course';

type CourseChartProps = {
  title: string;
  data: CourseChartSample[];
  dataKey: string;
  color?: string;
  reference?: boolean;
};

export const CourseChart = ({
  title,
  data,
  dataKey,
  color = '#287fbb',
  reference,
}: CourseChartProps) => (
  <section className="min-w-0 rounded-xl bg-muted/30 p-3 sm:p-4">
    <h3 className="mb-2 text-sm font-semibold">{title}</h3>
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={28}
            tick={{ fontSize: 10 }}
          />
          <ReferenceLine y={0} stroke="#71717a" />
          {reference && (
            <ReferenceLine y={1} stroke="#71717a" strokeDasharray="4 4" />
          )}
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default CourseChart;
