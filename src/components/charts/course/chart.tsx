import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  ChartSeries,
  CourseChart as CourseChartData,
} from '@/charts/course';

type CourseChartProps = { chart: CourseChartData };

const renderSeries = (series: ChartSeries) => {
  if (series.style === 'stem') {
    return (
      <Bar
        key={series.key}
        dataKey={series.key}
        name={series.name}
        fill={series.color}
        barSize={2}
        isAnimationActive={false}
      />
    );
  }
  if (series.style === 'points') {
    return (
      <Scatter
        key={series.key}
        dataKey={series.key}
        name={series.name}
        fill={series.color}
        isAnimationActive={false}
      />
    );
  }
  return (
    <Line
      key={series.key}
      type="monotone"
      dataKey={series.key}
      name={series.name}
      stroke={series.color}
      strokeWidth={2.5}
      {...(series.dashed ? { strokeDasharray: '7 5' } : {})}
      dot={false}
      connectNulls={false}
      isAnimationActive={false}
    />
  );
};

export const CourseChart = ({ chart }: CourseChartProps) => (
  <figure className="min-w-0" aria-label={chart.title}>
    <h3 className="mb-3 text-base font-semibold tracking-tight">
      {chart.title}
    </h3>
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chart.points}
          margin={{ top: 10, right: 16, bottom: 18, left: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#e8e8e8" />
          <XAxis
            type="number"
            dataKey="x"
            tickLine={false}
            axisLine={{ stroke: '#a1a1aa' }}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickCount={7}
            domain={['auto', 'auto']}
            label={{
              value: chart.xLabel,
              position: 'insideBottom',
              offset: -12,
              fill: '#71717a',
              fontSize: 12,
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: '#71717a', fontSize: 12 }}
            domain={chart.yDomain ?? ['auto', 'auto']}
            label={{
              value: chart.yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#71717a',
              fontSize: 12,
            }}
          />
          <Tooltip
            cursor={{ stroke: '#a1a1aa', strokeDasharray: '3 3' }}
            contentStyle={{
              border: '1px solid #e4e4e7',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#27272a', fontWeight: 600 }}
            formatter={(value) =>
              typeof value === 'number' ? value.toPrecision(4) : value
            }
          />
          {chart.references.map((reference) => (
            <ReferenceLine
              key={`${reference.axis}-${reference.value}`}
              {...(reference.axis === 'x'
                ? { x: reference.value }
                : { y: reference.value })}
              stroke="#71717a"
              strokeDasharray="5 5"
              label={{
                value: reference.label,
                fill: '#52525b',
                fontSize: 11,
                position: 'insideTopRight',
              }}
            />
          ))}
          {chart.series.map(renderSeries)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
    <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {chart.series.map((series) => (
        <span key={series.key} className="inline-flex items-center gap-2">
          {series.style === 'stem' ? (
            <span
              className="h-3 w-px"
              style={{ backgroundColor: series.color }}
            />
          ) : (
            <span
              className={`w-5 border-t-2 ${series.dashed ? 'border-dashed' : ''}`}
              style={{ borderColor: series.color }}
            />
          )}
          {series.name}
        </span>
      ))}
    </figcaption>
  </figure>
);

export default CourseChart;
