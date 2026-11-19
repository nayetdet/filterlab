import {
  CartesianGrid,
  Line,
  LineChart,
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
import type { WaveformPoint } from '@/types/audio-analysis';

type WaveformChartProps = {
  data: WaveformPoint[];
  cursorSample: number;
  onCursorSampleChange: (sample: number) => void;
};

const chartConfig = {
  original: { label: 'Original', color: '#58616a' },
  filtered: { label: 'Filtrado', color: '#287fbb' },
} satisfies ChartConfig;

export const WaveformChart = ({
  data,
  cursorSample,
  onCursorSampleChange,
}: WaveformChartProps) => {
  const selectedPoint = data.find((point) => point.sample === cursorSample);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full cursor-crosshair"
    >
      <LineChart
        data={data}
        margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
        onClick={(state) => {
          const point = data[Number(state?.activeTooltipIndex)];
          if (point) {
            onCursorSampleChange(point.sample);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 5" vertical={false} />
        <XAxis
          dataKey="timeMs"
          tickFormatter={(value: number) => `${value.toFixed(0)} ms`}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          domain={[-1.6, 1.6]}
          tickLine={false}
          axisLine={false}
          width={38}
          fontSize={12}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `${Number(value).toFixed(2)} ms`}
            />
          }
        />
        <ReferenceLine y={0} stroke="#b7bdc3" />
        {selectedPoint && (
          <ReferenceLine
            x={selectedPoint.timeMs}
            stroke="#198a76"
            strokeDasharray="3 4"
          />
        )}
        <Line
          type="monotone"
          dataKey="original"
          stroke="var(--color-original)"
          strokeWidth={1.4}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="filtered"
          stroke="var(--color-filtered)"
          strokeWidth={1.8}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default WaveformChart;
