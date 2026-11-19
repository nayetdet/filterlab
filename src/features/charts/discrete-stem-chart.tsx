import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export type StemPoint = { index: number; value: number; active?: boolean };

type DiscreteStemChartProps = {
  data: StemPoint[];
  color: string;
  height?: number;
  domain?: [number, number];
};

const chartConfig = {
  value: { label: 'Amplitude', color: '#287fbb' },
} satisfies ChartConfig;

export const DiscreteStemChart = ({
  data,
  color,
  height = 190,
  domain,
}: DiscreteStemChartProps) => (
  <ChartContainer
    config={chartConfig}
    className="aspect-auto w-full"
    style={{ height }}
  >
    <BarChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="index" tickLine={false} axisLine={false} fontSize={12} />
      <YAxis
        domain={domain ?? ['auto', 'auto']}
        tickLine={false}
        axisLine={false}
        width={38}
        fontSize={12}
      />
      <ReferenceLine y={0} stroke="#626b73" strokeWidth={1.5} />
      <ChartTooltip
        content={
          <ChartTooltipContent labelFormatter={(value) => `n = ${value}`} />
        }
      />
      <Bar dataKey="value" barSize={14} radius={[2, 2, 0, 0]}>
        {data.map((point) => (
          <Cell key={point.index} fill={point.active ? '#178775' : color} />
        ))}
      </Bar>
    </BarChart>
  </ChartContainer>
);

export default DiscreteStemChart;
