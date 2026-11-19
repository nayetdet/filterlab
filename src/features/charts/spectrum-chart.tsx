import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { ToneAmplitude } from '@/types/audio-analysis';

type SpectrumChartProps = {
  data: ToneAmplitude[];
  fftSpectrum?: ToneAmplitude[];
  showFft: boolean;
};

const chartConfig = {
  original: { label: 'Original', color: '#5f6871' },
  filtered: { label: 'Filtrado', color: '#287fbb' },
} satisfies ChartConfig;

export const SpectrumChart = ({
  data,
  fftSpectrum = [],
  showFft,
}: SpectrumChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-auto h-[210px] w-full">
    <BarChart
      data={showFft ? fftSpectrum : data}
      margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="frequency"
        tickFormatter={(value: number) => `${value} Hz`}
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        fontSize={12}
      />
      <YAxis
        domain={[0, 1.4]}
        tickLine={false}
        axisLine={false}
        width={42}
        fontSize={12}
      />
      <ChartTooltip
        content={
          <ChartTooltipContent labelFormatter={(value) => `${value} Hz`} />
        }
      />
      <Bar
        dataKey="original"
        fill="var(--color-original)"
        barSize={showFft ? 3 : 8}
        radius={[2, 2, 0, 0]}
      />
      <Bar
        dataKey="filtered"
        fill="var(--color-filtered)"
        barSize={showFft ? 3 : 8}
        radius={[2, 2, 0, 0]}
      />
    </BarChart>
  </ChartContainer>
);

export default SpectrumChart;
