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
import { designFir, frequencyResponse } from '@/utils/dsp';
import type { AudioSettings } from '@/types/audio-settings';

type FrequencyResponseChartProps = {
  settings: AudioSettings;
  responseScale: 'linear' | 'db';
  showNegativeFrequencies: boolean;
  showTransitionSketch: boolean;
  cursorFrequency: number;
  onSelectFrequency: (frequency: number) => void;
};

const chartConfig = {
  fir: { label: 'FIR calculado', color: '#287fbb' },
  ideal: { label: 'Ideal', color: '#7c858d' },
} satisfies ChartConfig;

export const FrequencyResponseChart = ({
  settings,
  responseScale,
  showNegativeFrequencies,
  showTransitionSketch,
  cursorFrequency,
  onSelectFrequency,
}: FrequencyResponseChartProps) => {
  const impulse = designFir(settings.filterKind, settings.cutoff);
  const frequencies = Array.from(
    { length: showNegativeFrequencies ? 401 : 201 },
    (_, index) => (showNegativeFrequencies ? index * 40 - 8000 : index * 40),
  );
  const data = frequencies.map((frequency) => {
    const normalized = Math.abs(frequency);
    const gain = frequencyResponse(impulse, frequency);
    let ideal =
      settings.filterKind === 'lowpass'
        ? Number(normalized <= settings.cutoff)
        : Number(normalized >= settings.cutoff);
    if (showTransitionSketch) {
      const transition = Math.max(80, settings.cutoff * 0.025);
      const position = (normalized - settings.cutoff) / transition;
      const ramp = Math.max(0, Math.min(1, 0.5 + position * 0.5));
      ideal = settings.filterKind === 'lowpass' ? 1 - ramp : ramp;
    }
    const display = (value: number) =>
      responseScale === 'db'
        ? Math.max(-60, 20 * Math.log10(Math.max(value, 0.001)))
        : value;
    return { frequency, fir: display(gain), ideal: display(ideal) };
  });
  const domain = showNegativeFrequencies
    ? ([-8000, 8000] as [number, number])
    : ([0, 8000] as [number, number]);
  const ticks = showNegativeFrequencies
    ? [-8000, -4000, 0, 4000, 8000]
    : [0, 2000, 4000, 6000, 8000];
  const axisDomain =
    responseScale === 'db'
      ? ([-60, 12] as [number, number])
      : ([0, 1.2] as [number, number]);
  const frequenciesToMark = showNegativeFrequencies
    ? [-settings.cutoff, settings.cutoff]
    : [settings.cutoff];

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[320px] w-full cursor-crosshair"
    >
      <LineChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        onClick={(state) => {
          const frequency = state?.activeLabel;
          if (typeof frequency === 'number') {
            onSelectFrequency(frequency);
          }
        }}
      >
        <CartesianGrid vertical strokeDasharray="3 5" />
        <XAxis
          dataKey="frequency"
          type="number"
          domain={domain}
          ticks={ticks}
          tickFormatter={(value: number) =>
            value === 0 ? '0' : `${value / 1000}k`
          }
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={12}
          unit=" Hz"
        />
        <YAxis
          domain={axisDomain}
          tickFormatter={(value: number) =>
            responseScale === 'db' ? `${value} dB` : value.toFixed(1)
          }
          tickLine={false}
          axisLine={false}
          width={48}
          fontSize={12}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                `${Number(value).toLocaleString('pt-BR')} Hz`
              }
            />
          }
        />
        <ReferenceLine
          y={responseScale === 'db' ? 0 : 1}
          stroke="#b7bdc3"
          strokeDasharray="3 4"
        />
        {frequenciesToMark.map((frequency) => (
          <ReferenceLine
            key={frequency}
            x={frequency}
            stroke="#d35b58"
            strokeDasharray="4 4"
          />
        ))}
        <ReferenceLine
          x={cursorFrequency}
          stroke="#198a76"
          strokeDasharray="2 4"
        />
        <Line
          type="stepAfter"
          dataKey="ideal"
          stroke="var(--color-ideal)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="fir"
          stroke="var(--color-fir)"
          strokeWidth={2.25}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default FrequencyResponseChart;
